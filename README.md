# GRC Lab · Səviyyə 1

İnformasiya təhlükəsizliyi siyasəti və işçilərin giriş auditi üzrə praktik laboratoriya. Eyni qrupdakı tələbələr **eyni şirkət datası** ilə işləyir, qruplar arası data fərqlidir. Hər tələbə siyasət yazır, hesab auditi aparır və müəllimə **təhvil kodu** göndərir. Tələbə təhvildən dərhal sonra öz nəticəsini görür, cavabları isə bağlanır. Müəllim paneli bütün tələbələrin ümumi nəticələrini, iş prosesinin siqnallarını və şifahi yoxlama suallarını göstərir.

| Səhifə | Kim üçün | Ünvan (Pages aktiv olandan sonra) |
|---|---|---|
| Laboratoriya | tələbələr | `https://<istifadəçi>.github.io/<repo>/` |
| Müəllim paneli | müəllim | `https://<istifadəçi>.github.io/<repo>/muellim.html` |

## 1. GitHub Pages-i yandırın

1. Repoda **Settings → Pages**.
2. **Source:** "Deploy from a branch". **Branch:** `main`, qovluq: `/docs`. **Save**.
3. 1–2 dəqiqədən sonra yuxarıda saytın ünvanı görünəcək.

## 2. Dərsdə necə işləyir

1. Tələbələrə **qrup adını** deyin (məs. `ZS111`): eyni qrup adı eyni datanı verir, böyük-kiçik hərf və boşluq fərq etmir. Hər tələbəyə şəxsi **tələbə kodu** da verin (tələbə bileti nömrəsi və ya GRC-01, GRC-02, …). Panel eyni kodla iki fərqli adı qırmızı ilə göstərir və qrup daxilində oxşar mətnləri tutur.
2. Tələbələr laboratoriya linkini açır, adını və kodunu yazır və 5 mərhələni keçir. **Təhvil ver** düyməsindən sonra cavablar bağlanır və tələbə audit hissəsinin nəticəsini (45 xal) hesablar üzrə izahla görür. Sonra **təhvil kodunu** kopyalayıb sizə göndərir (e-poçt, Google Classroom).
3. Siz kodları müəllim panelinə yapışdırırsınız. Panel:
   - auditi (45 xal) cavab açarı ilə yoxlayır;
   - siyasət (40) və ən ciddi tapıntı (15) üçün bal təklif edir, yekun balı siz yazırsınız;
   - yapışdırma, yazma vaxtı, səhifədən çıxma, dərs nümunəsindən köçürmə və tələbələr arası oxşarlıq siqnallarını göstərir;
   - hər tələbə üçün öz datasına əsaslanan şifahi yoxlama sualları hazırlayır.
4. **Ümumi nəticələr** bölməsində bütün tələbələr bala görə sıralanır, qrup filtri var. Bu cədvəli yalnız siz görürsünüz.
5. Tələbə nəticəsini gördükdən sonra brauzeri təmizləyib yenidən təhvil versə, panel **ilk təhvili** saxlayır və təkrar cəhdi qırmızı siqnal kimi göstərir.

> Müəllim paneli məlumatı **sizin brauzerinizdə** saxlayır. Başqa kompüterə keçəndə panelin aşağısındakı **Ehtiyat nüsxə** ilə köçürün.

## Bilməli olduğunuz məhdudiyyətlər

- **AI istifadəsini birbaşa sübut edən alət yoxdur.** Panel yalnız siqnallar göstərir. Şübhə olduqda şifahi sualları soruşun: tələbə öz datasını izah edə bilirsə, iş onundur.
- Tələbə AI mətnini əl ilə yenidən yazsa, proses qeydi bunu görmür.
- Hər şey brauzerdə işlədiyi üçün texniki bacarıqlı tələbə səhifənin kodunu oxuyub cavab açarını hesablaya bilər. Repo açıq olduğu üçün müəllim panelinin ünvanı da gizli deyil. Panel tələbə işlərini yalnız sizin brauzerinizdə saxlayır, ona görə başqası onu açsa boş görəcək.
- Təhvil kodundakı yoxlama imzası təsadüfi dəyişikliyi tutur, kriptoqrafik qoruma deyil.

## Dəyişiklik etmək

Mənbə faylları `src/` qovluğundadır. Dəyişiklikdən sonra:

```bash
python3 build.py
```

Bu əmr `docs/` (GitHub Pages) və `dist/` (Claude artifact versiyaları) qovluqlarını yenidən qurur.

| Fayl | Məzmun |
|---|---|
| `src/core.js` | fərdi data generatoru, cavab açarı, avtomatik bal, proses siqnalları, təhvil kodu |
| `src/student.html` | tələbə laboratoriyası |
| `src/teacher.html` | müəllim paneli |
