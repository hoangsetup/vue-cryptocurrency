// API dành cho việc lấy thông tin của các đồng tiến số
// (thông tin chúng ta cần là logo images của các loại tiền)
// Doc: https://www.cryptocompare.com/api/
let CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com";

// Thời gian sẽ update lại thông tin đang hiển thị
let UPDATE_INTERVAL = 60 * 1000;

let app = new Vue({
    el: "#app",
    data: {
        coins: [], // Array chứ thông tin các đồng tiền khác nhau(bitcoin, ethereum...)
    },
    created: function () {
        this.getCoins();
    },
    methods: {
        /**
         * Lấy thông tin top 10 đồng tiền phổ biến
         * Thông tin sẽ được refresh sau UPDATE_INTERVAL / 1000 seconds
         * bằng cách gọi lại API
         */
        getCoins: function () {
            axios.get(CRYPTOCOMPARE_API_URI + "/data/top/totalvolfull?limit=10&tsym=USD")
                .then((resp) => {
                    this.coins = resp.data.Data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },

        /**
         * Truyền vào ký hiệu của đồng tiền, trả ra logo của đồng tiền đó
         */
        getCoinImage: function (coin) {
            return "https://cryptocompare.com" + coin.CoinInfo.ImageUrl;
        },
    }
});

// Tự động cập nhật thông tin
setInterval(() => {
    app.getCoins();
}, UPDATE_INTERVAL);
