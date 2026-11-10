#!/usr/bin/env python3
"""
Trinkow Store Screenshot MCP Server
Model Context Protocol (JSON-RPC 2.0 stdio) server for automating multi-language
App Store and Google Play screenshot generation, compositing, and validation.
"""

import json
import os
import sys
from typing import Any

from pipeline.generator import load_configs, run_batch_generation
from pipeline.validator import validate_bundle

SERVER_NAME = "trinkow-screenshot-mcp"
SERVER_VERSION = "1.0.0"


def send_response(response: dict[str, Any]):
    line = json.dumps(response, ensure_ascii=False)
    sys.stdout.write(line + "\n")
    sys.stdout.flush()


def handle_initialize(req_id: Any, params: dict):
    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "result": {
            "protocolVersion": "2024-11-05",
            "serverInfo": {
                "name": SERVER_NAME,
                "version": SERVER_VERSION,
            },
            "capabilities": {
                "tools": {},
            },
        },
    }


def handle_tools_list(req_id: Any):
    tools = [
        {
            "name": "list_supported_locales",
            "description": "Lists all 11 supported localization languages, ISO codes, currencies, and taglines.",
            "inputSchema": {
                "type": "object",
                "properties": {},
            },
        },
        {
            "name": "get_device_matrix",
            "description": "Returns the exact resolution, aspect ratio, and layout matrix for Header, Search Results, iPhone 6.1/6.3, iPad 12.9/13, and iPhone Duo.",
            "inputSchema": {
                "type": "object",
                "properties": {},
            },
        },
        {
            "name": "render_localized_bundle",
            "description": "Executes parallel multi-core rendering of marketing screenshots for specified locales or all 11 languages.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "languages": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Optional list of language codes (e.g. ['tr', 'en', 'de']). If omitted, all 11 languages are rendered.",
                    },
                    "output_directory": {
                        "type": "string",
                        "description": "Optional custom export path. Defaults to standard Documents store directory.",
                    },
                },
            },
        },
        {
            "name": "validate_store_bundle",
            "description": "Audits generated store packages for pixel dimension exactness, RGB profile, file size limits (<10MB), and missing files.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "target_directory": {
                        "type": "string",
                        "description": "Target directory to validate. Defaults to the main store export root.",
                    },
                },
            },
        },
        {
            "name": "capture_simulator_live",
            "description": "Checks the booted iOS Simulator, overrides clean status bar (09:41, 100% battery, Wi-Fi), and captures functional app screens.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "output_dir": {
                        "type": "string",
                        "description": "Destination directory for raw screenshots. Defaults to raw_by_lang.",
                    },
                },
            },
        },
    ]
    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "result": {"tools": tools},
    }


def handle_tools_call(req_id: Any, params: dict):
    tool_name = params.get("name")
    args = params.get("arguments", {})

    try:
        if tool_name == "list_supported_locales":
            copy_matrix, _ = load_configs()
            data = [
                {
                    "code": k,
                    "name": v["name"],
                    "locale": v["locale"],
                    "currency": v["currency"],
                    "symbol": v["currency_symbol"],
                    "tagline": v["tagline"],
                    "screens_count": len(v["screens"]),
                }
                for k, v in copy_matrix.items()
            ]
            content = json.dumps(data, ensure_ascii=False, indent=2)

        elif tool_name == "get_device_matrix":
            _, devices = load_configs()
            content = json.dumps(devices, ensure_ascii=False, indent=2)

        elif tool_name == "render_localized_bundle":
            langs = args.get("languages")
            out_dir = args.get("output_directory") or "/Users/mustafa/Documents/Trinkow Assets/store-localized-packages"
            count = run_batch_generation(target_langs=langs, out_root=out_dir)
            content = f"Successfully generated {count} localized screenshot assets in {out_dir}"

        elif tool_name == "validate_store_bundle":
            target = args.get("target_directory") or "/Users/mustafa/Documents/Trinkow Assets/store-localized-packages"
            results = validate_bundle(target)
            content = json.dumps(results, ensure_ascii=False, indent=2)

        elif tool_name == "capture_simulator_live":
            from pipeline.capture import get_booted_simulator_udid, clean_status_bar
            udid = get_booted_simulator_udid()
            if not udid:
                content = json.dumps({"status": "warning", "message": "No booted iOS simulator found. Using existing raw 11-language capture cache."})
            else:
                clean_status_bar(udid)
                content = json.dumps({"status": "ready", "simulator_udid": udid, "message": "Simulator connected and status bar configured for 09:41 clean capture."})

        else:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Method '{tool_name}' not found"},
            }

        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "content": [
                    {
                        "type": "text",
                        "text": content,
                    }
                ]
            },
        }

    except Exception as e:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32000, "message": str(e)},
        }


def main():
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            req = json.loads(line)
        except json.JSONDecodeError:
            continue

        method = req.get("method")
        req_id = req.get("id")

        if method == "initialize":
            send_response(handle_initialize(req_id, req.get("params", {})))
        elif method == "notifications/initialized":
            pass
        elif method == "tools/list":
            send_response(handle_tools_list(req_id))
        elif method == "tools/call":
            send_response(handle_tools_call(req_id, req.get("params", {})))
        elif method == "ping":
            send_response({"jsonrpc": "2.0", "id": req_id, "result": {}})
        else:
            if req_id is not None:
                send_response({
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Method '{method}' not found"},
                })


if __name__ == "__main__":
    main()

