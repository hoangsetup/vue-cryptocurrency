// API dành cho việc lấy thông tin của các đồng tiến số
// (thông tin chúng ta cần là logo images của các loại tiền)
// Doc: https://www.cryptocompare.com/api/
let CRYPTOCOMPARE_API_URI = "https://www.cryptocompare.com";

// API dành cho việc lấy các thông tin quan trọng của top 10 đồng tiền số
// Doc: https://coinmarketcap.com/api/
let COINMARKETCAP_API_URI = "https://api.coinmarketcap.com";

// Thời gian sẽ update lại thông tin đang hiển thị
let UPDATE_INTERVAL = 60 * 1000;

let app = new Vue({
    el: "#app",
    data: {
        coins: [], // Array chứ thông tin các đồng tiền khác nhau(bitcoin, ethereum...)
        coinData: {} // Đối tượng chứa kết quả của API CryptoCompare. Chúng ta sẽ dùng nó để lấy ra thông tin logos
    },
    created: function () {
        this.getCoinData();
    },
    methods: {

        /**
         * Lấy thông tin của tất cả các đồng tiền, thông tin được sử dụng để lấy ra
         * logo tương ứng của từng đồng tiền.
         */
        getCoinData: function () {
            let self = this;
            axios.get("./static/coins.json")
                .then((resp) => {
                    this.coinData = resp.data.Data;
                    this.getCoins();
                })
                .catch((err) => {
                    this.getCoins();
                    console.error(err);
                });
        },

        /**
         * Lấy thông tin top 10 đồng tiền phổ biến
         * Thông tin sẽ được refresh sau UPDATE_INTERVAL / 1000 seconds
         * bằng cách gọi lại API
         */
        getCoins: function () {
            let self = this;
            axios.get(COINMARKETCAP_API_URI + "/v1/ticker/?limit=10")
                .then((resp) => {
                    this.coins = resp.data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },

        /**
         * Truyền vào ký hiệu của đồng tiền, trả ra logo của đồng tiền đó
         */
        getCoinImage: function (symbol) {
            symbol = (symbol === "MIOTA" ? "IOT" : symbol);
            symbol = (symbol === "VERI" ? "VRM" : symbol);
            symbol = (symbol === "BCC" ? "BCCOIN" : symbol);
            if (!this.coinData[symbol]) {
                console.log('Special symbol', symbol);
                return;
            }
            return CRYPTOCOMPARE_API_URI + this.coinData[symbol].ImageUrl;
        },
        getColor: (num) => {
            return num > 0 ? "color:green;" : "color:red;";
        }
    }
});

// Tự động cập nhật thông tin
setInterval(() => {
    app.getCoins();
}, UPDATE_INTERVAL);
