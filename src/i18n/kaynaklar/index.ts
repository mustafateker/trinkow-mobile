/**
 * Bütün dil paketlerini çekirdeğe kaydeder (ActivationKing `LocalizationService.Register`).
 * Uygulama kökü (`app/_layout.tsx`) bu dosyayı EN BAŞTA bir kez içe aktarır.
 * Aktif dil `dilDeposu.ts#dilBaslat` ile seçilir; eksik çeviri İngilizce'ye, o da yoksa Türkçe'ye düşer.
 */
import { paketKaydet } from '../cekirdek';
import cs from './cs';
import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import it from './it';
import pl from './pl';
import pt from './pt';
import ro from './ro';
import ru from './ru';
import tr from './tr';

paketKaydet('en', en);
paketKaydet('tr', tr);
paketKaydet('de', de);
paketKaydet('fr', fr);
paketKaydet('es', es);
paketKaydet('it', it);
paketKaydet('pt', pt);
paketKaydet('ro', ro);
paketKaydet('pl', pl);
paketKaydet('ru', ru);
paketKaydet('cs', cs);
