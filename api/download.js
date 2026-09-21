const axios = require('axios');

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { url } = req.query;
        if (!url) return res.json({ success: false, message: 'URL kosong' });

        const apiRes = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
        const data = apiRes.data;

        if (data.code !== 0 || !data.data) {
            return res.json({ success: false, message: data.msg || 'Gagal ambil video' });
        }

        const v = data.data;
        const baseUrl = 'https://www.tikwm.com';

        res.json({
            success: true,
            data: {
                title: v.title || 'TikTok Video',
                cover: v.cover?.startsWith('http') ? v.cover : baseUrl + v.cover,
                video_hd: v.hdplay?.startsWith('http') ? v.hdplay : baseUrl + v.hdplay,
                video_sd: v.play?.startsWith('http') ? v.play : baseUrl + v.play,
                music: v.music?.startsWith('http') ? v.music : baseUrl + v.music,
                author: {
                    unique_id: v.author?.unique_id || 'user',
                    nickname: v.author?.nickname || 'TikTok User',
                    avatar: v.author?.avatar?.startsWith('http') ? v.author.avatar : baseUrl + v.author.avatar
                },
                stats: {
                    digg_count: v.digg_count || 0,
                    comment_count: v.comment_count || 0,
                    share_count: v.share_count || 0,
                    play_count: v.play_count || 0
                }
            }
        });

    } catch (err) {
        res.json({ success: false, message: 'Gagal ambil video: ' + err.message });
    }
};
