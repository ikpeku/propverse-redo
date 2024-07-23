
const allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:3000',
    'localhost:3000',
    'http://127.0.0.1:3000',
    'https://www.yourwebsite.com', //front-end website
]


exports.corsConfigs = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // remove ||!origin to block postman request
            callback(null, true)
        } else {
            callback(new Error('origin not allowed by Cors'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}
