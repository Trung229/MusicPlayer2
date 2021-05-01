const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const togglePlay = $('.btn-toggle-play')
const progress = $('#progress')
const nextButton = $('.btn-next')
const preButton = $('.btn-prev')
const random = $('.btn-random')
const repeat = $('.btn-repeat');
const playList = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [{
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: './db/music/MuonRoiMaSaoCon.mp3',
            Thumbnail: './db/img/MuonRoiMaSaoCon.jpg'
        },
        {
            name: 'To The Moon',
            singer: 'Hooligan',
            path: './db/music/ToTheMoon.mp3',
            Thumbnail: './db/img/ToTheMoon.jpg'
        },
        {
            name: 'Hạ Còn Vương Nắng',
            singer: 'DATKAA x KIDO x Prod. QT BEATZ',
            path: './db/music/HaConVuongNang.mp3',
            Thumbnail: './db/img/HaConVuongNang.jpg'
        },
        {
            name: 'Mlem Mlem Mlem',
            singer: 'MIN X JUSTATEE X YUNO BIGBOI',
            path: './db/music/MLEM MLEM - MIN X JUSTATEE X YUNO BIGBOI - OFFICIAL MUSIC VIDEO.mp3',
            Thumbnail: './db/img/MlemMlemMlem.jpg'
        },
        {
            name: 'Thở',
            singer: 'Dalab',
            path: './db/music/Thở - Da LAB ft. Juky San (Official MV).mp3',
            Thumbnail: './db/img/Thở.jpg'
        },
        {
            name: 'Xin đừng nhấc máy',
            singer: 'Bray and HanSara',
            path: './db/music/XIN ĐỪNG NHẤC MÁY - B RAY X HAN SARA [OFFICIAL MV].mp3',
            Thumbnail: './db/img/XinEmDungNhacMay.jpg'
        },
    ],
    render: function() {
        const html = this.songs.map(function(song, index) {

            return `
            <div class="song ${index === app.currentIndex ? 'active':''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.Thumbnail}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
`
        })

        playList.innerHTML = html.join('')
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.Thumbnail}')`
        audio.src = this.currentSong.path;

    },
    definedProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    preSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    scrollTopActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })

        }, 100)
    },
    handleEvents: function() {
        const cdWith = cd.offsetWidth;
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        })

        cdThumbAnimate.pause()
        document.onscroll = function(e) {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newWidth = cdWith - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0 + 'px';
            cd.style.opacity = newWidth / cdWith;
        }
        togglePlay.onclick = function(e) {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }


        }
        console.log(cdThumbAnimate);

        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;

        }

        nextButton.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollTopActiveSong();
        }
        preButton.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.preSong();
            }
            audio.play();
            app.render();
            app.scrollTopActiveSong();

        }
        random.onclick = function(e) {
            app.isRandom = !app.isRandom;
            random.classList.toggle('active', app.isRandom);
        }

        repeat.onclick = function() {
            app.isRepeat = !app.isRepeat;
            repeat.classList.toggle('active', app.isRepeat);

        }
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextButton.click();

            }
        }
        playList.onclick = function(e) {
            const songElement = e.target.closest('.song:not(.active)');
            if (songElement || e.target.closest('.option')) {
                if (songElement) {
                    console.log(typeof songElement.getAttribute('data-index'))
                    app.currentIndex = Number(songElement.getAttribute('data-index'))
                    app.loadCurrentSong()
                    audio.play();
                    app.render();
                }
            }
        }
    },
    start: function() {
        this.definedProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render()

    }
};

app.start();

var name = "trung";