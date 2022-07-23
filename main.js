const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('.name-song');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
console.log();

const app = {

isPlaying: false,
isRandom: false,
isRepeat: false,

currentIndex : 0,

songs: [
        {
            name: 'Bỏ em vào balo',
            singer: 'Tân Trần-Freak D',
            path: './music/song1.mp3',
            image: 'https://i.scdn.co/image/ab67616d00001e021175bac962d3122237002031'
        },
        {
            name: 'Lạ lùng',
            singer: 'Vũ',
            path: './music/song2.mp3',
            image: 'https://i.ytimg.com/vi/F5tS5m86bOI/maxresdefault.jpg'
        },
        
    
        {
            name: 'Lạc vào trong mơ',
            singer: 'Simon C - WuyCukak',
            path: './music/song3.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/4/c/2/8/4c282e19915377775b55081874f03941.jpg'
        },
    
        {
            name: 'There\'s no One At All',
            singer: 'Son Tung M-TP',
            path: './music/song4.mp3',
            image: 'https://nld.mediacdn.vn/291774122806476800/2022/4/29/anh-chup-man-hinh-2022-04-29-luc-144829-1651218740530530001272.png'
        },
    
        {
            name: 'GENE',
            singer: 'TOULIVER X BINZ',
            path: './music/song5.mp3',
            image: 'https://ss-images.saostar.vn/2019/05/13/5177543/batch_geneartwork.jpg'
        },
    
        {
            name: 'BẮT CÓC CON TIM',
            singer: 'LOU HOÀNG',
            path: './music/song6.mp3',
            image: 'https://i.ytimg.com/vi/22XC-3Q-rRA/maxresdefault.jpg'
        },
    
        {
            name: 'OK',
            singer: 'BINZ',
            path: './music/song7.mp3',
            image: 'https://i.ytimg.com/vi/SNES5Y-tYxM/mqdefault.jpg'
        },

        {
            name: 'Vì ai',
            singer: 'Khói',
            path: './music/song8.mp3',
            image: 'https://ss-images.saostar.vn/2019/05/13/5177543/batch_geneartwork.jpg'
        }
    ],

    render: function(){
        const htmls = this.songs.map((song,i) => {
            return `
                <div class="song" data-index="${i}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                                <div class="option">
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>
                    </div>  
                </div>
            `
        })

        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this,'currentSong' ,{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    // when song active
    activeSong: function(){
        var listsong = $$(".song")
        if($(".song.active")) $(".song.active").classList.remove('active');
        listsong.forEach(function(e, i){
            if(app.currentIndex === i){
                e.classList.add("active");
            }
        })
    },

    scrolltoActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        },100)
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth;

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // handle when click play button
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        // when the song is play
        audio.onplay = ()=>{
            player.classList.add('playing');
            app.isPlaying = true;
            cdThumbAnimate.play();
        }

        // when the song is pause
        audio.onpause = () => {
            player.classList.remove('playing');
            app.isPlaying = false;
            cdThumbAnimate.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                progress.value = audio.currentTime / audio.duration * 100;
            }
        }

        // tua bài hát
        progress.oninput = function(e){
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 15000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // when next song
        nextBtn.onclick = function(){
            if(app.isRandom) app.playRandomSong();
            else app.nextSong();
            audio.play();
        }

        // when previous song
        prevBtn.onclick = function(){
            if(app.isRandom) app.playRandomSong();
            else app.preSong();
            audio.play(); 

        }

        // random playlist
        randomBtn.onclick = function(e){
            app.isRandom = !app.isRandom;
            this.classList.toggle('active',app.isRandom);
        }

        // repeat song
        repeatBtn.onclick= function(){
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('repeat-active', app.isRepeat);
        }
        // next song when audio ended
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            }
            else nextBtn.click();
        }

        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode && !e.target.closest('.option'))
                app.currentIndex = Number(songNode.dataset.index);
                app.loadCurrentSong();
                audio.play();
        }
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
        app.activeSong();  
        app.scrolltoActiveSong();
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    preSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex = this.currentIndex;
        do{
            this.currentIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.loadCurrentSong();
    },

    start: function(){
        // define properties for object
        this.defineProperties();

        // listen/ handle for event(DOM event)
        this.handleEvents();

        // load current song information to the UI when running web
        this.loadCurrentSong();

        // Render playlist
        this.render();

        this.activeSong();  
    }

} 

app.start();

