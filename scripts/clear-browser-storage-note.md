# Clear browser storage note

Dacă Vercel deploy este verde, dar browserul încă se blochează din cauza datelor vechi, deschide DevTools → Console și rulează:

```js
localStorage.removeItem("servelect-work-os-store-v2");
localStorage.removeItem("servelect-work-os-store-v3");
location.reload();
```
