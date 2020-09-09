let tag1 = '<a style="font-size: 24px;font-weight: bold;color: #0962a8;text-decoration: none;" href="/articles/vnimanie-o-meste-posadki-na-teplokhody/">Информация о месте посадки на теплоход.</a><br>';
let tag2 = '<a style="font-size: 24px;font-weight: bold;color: #0962a8;text-decoration: none;" href="/tablo-severnogo-rechnogo-vokzala/">Табло Северного Речного Вокзала</a>';
let hDiv = document.getElementById('top-news');
if(hDiv) {
    hDiv.innerHTML = tag1 + tag2;
}