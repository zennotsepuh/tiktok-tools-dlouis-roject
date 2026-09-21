const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const { q } = req.query;
        if (!q) return res.json({ success: false, message: 'Keyword kosong' });

        const apiRes = await axios.get(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20&cursor=0&web=1`);
        const data = apiRes.data;

        if (data.code !== 0 || !data.data?.videos) {
            return res.json({ success: false, message: 'Gak ada hasil' });
        }

        const videos = data.data.videos.map(v => ({
            title: v.title || 'TikTok Video',
            cover: v.cover?.startsWith('http') ? v.cover : 'https://www.tikwm.com' + v.cover,
            url: `https://www.tiktok.com/@${v.author?.unique_id}/video/${v.video_id}`,
            author: v.author?.unique_id || 'user',
            plays: v.play_count || 0
        }));

        res.json({ success: true, data: videos });

    } catch (err) {
        res.json({ success: false, message: 'Gagal search: ' + err.message });
    }
};
