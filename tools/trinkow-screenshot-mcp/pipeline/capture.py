"""
Simulator Capture Helper for Trinkow Store Screenshot MCP
Uses xcrun simctl to interface with the booted iOS Simulator,
navigates through routes via deep links or in-app switching, and captures raw screens.
"""

import os
import subprocess
import time

ROUTES = [
    ("01_bugun", "trinkow://(tabs)"),
    ("02_tasarruf", "trinkow://(tabs)/kayitlar"),
    ("03_analiz", "trinkow://(tabs)/ozet"),
    ("04_profil", "trinkow://ayarlar"),
    ("05_harcama_ekle", "trinkow://harcama-ekle"),
    ("06_abonelikler", "trinkow://abonelikler"),
    ("07_butce", "trinkow://butce"),
]


def get_booted_simulator_udid() -> str | None:
    try:
        out = subprocess.check_output(
            ["xcrun", "simctl", "list", "devices", "booted"],
            text=True,
        )
        for line in out.splitlines():
            if "(Booted)" in line:
                start = line.find("(")
                end = line.find(")", start + 1)
                if start != -1 and end != -1:
                    udid = line[start + 1 : end].strip()
                    if len(udid) == 36:
                        return udid
        return None
    except Exception:
        return None


def clean_status_bar(udid: str):
    try:
        subprocess.run(
            [
                "xcrun",
                "simctl",
                "status_bar",
                udid,
                "override",
                "--time",
                "09:41",
                "--dataNetwork",
                "wifi",
                "--wifiMode",
                "active",
                "--wifiBars",
                "3",
                "--cellularMode",
                "active",
                "--cellularBars",
                "4",
                "--batteryState",
                "charged",
                "--batteryLevel",
                "100",
            ],
            check=True,
            capture_output=True,
        )
    except Exception as e:
        print(f"Status bar override warning: {e}")


def capture_screen(udid: str, out_path: str):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    subprocess.run(
        ["xcrun", "simctl", "io", udid, "screenshot", out_path],
        check=True,
        capture_output=True,
    )


def navigate_and_snap(udid: str, route_url: str, out_path: str, wait_seconds: float = 1.0):
    try:
        subprocess.run(
            ["xcrun", "simctl", "openurl", udid, route_url],
            check=False,
            capture_output=True,
        )
        time.sleep(wait_seconds)
    except Exception:
        pass
    capture_screen(udid, out_path)

