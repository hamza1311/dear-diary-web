module.exports = {
    reactStrictMode: true,
    target: "serverless",
    webpack: (config, { isServer }) => {
        // Important: return the modified config
        if (!isServer) {
            config.resolve.fallback.fs = false
            config.resolve.fallback.child_process = false
            config.resolve.fallback.request = false
            config.resolve.fallback.net = false
            config.resolve.fallback.worker_threads = false
            config.resolve.fallback.tls = false
        }
        return config
    },
}
