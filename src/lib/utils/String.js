/**
 * @description extracts teh video ID from url
 * @param {string} videoUrl video url
 * @returns {string} video ID
 */
export function youtubeGetId(videoUrl) {
    let id = '';

    const url = videoUrl.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_-]/i);
        [id] = id;
    } else {
        id = url;
    }
    return id;
}

export const digitsOnly = value => value.replace(/\D+/g, '');
