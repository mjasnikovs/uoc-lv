const text = `[cat]jaunums[/cat]
[imgb]http://img.uoc.lv/images/521e744a2ae507e08491a65c1f7b7c82.jpg[/imgb][imgu]0[/imgu]Sveicināti trešajā UOC.LV podkāstā!&lt;br/&gt;&lt;br/&gt;[big]Tēmas:[/big]&lt;br/&gt;Kas pa nedēļu sadarīts?&lt;br/&gt;Ko mēs šonedēļ spēlējām?&lt;br/&gt; &lt;br/&gt;Nedēļas tops! &lt;br/&gt;The Lonely Island [url]http://tinyurl.com/ce49lo[/url]&lt;br/&gt;&lt;br/&gt;[b]Mass Effect 3[/b] būs kooperatīvais režīms. &lt;br/&gt;[b]BF3[/b] vs [b]MW3[/b] kooperatīvais režīms. [url]http://tinyurl.com/67hx5c2[/url]&lt;br/&gt;[b]Unreal Engin 3[/b] jauns faunas dzinis. [url]http://twitpic.com/5i48mj[/url]&lt;br/&gt;[b]MLAA[/b] beidzot būs arī uz [b]Xbox 360[/b]. [url]http://tinyurl.com/2br4bgz[/url]&lt;br/&gt;[b]Battlefield 3[/b] pārdotāks par [b]Modern Warfare 3[/b]. [url]http://tinyurl.com/3q4z9ky[/url]&lt;br/&gt;[b]Nintendo U[/b] atbalstīs tikai vienu [b]WiiPad[/b] un ir vārgāks par [b]Xbox 360[/b].&lt;br/&gt;[b]Steam[/b]'ā vasaras atlaides.&lt;br/&gt;&lt;br/&gt;Klausītāju komentāri un jautājumi.&lt;br/&gt;&lt;br/&gt;[center][b]Podkāsts[/b][/center][mp3]http://cdn.uoc.lv/uoc.lv-podkasts-3.mp3[/mp3]&lt;br/&gt;Lejuplādēs links: [url=&quot;http://cdn.uoc.lv/uoc.lv-podkasts-3.mp3&quot;]podkasts-3[/url]&lt;br/&gt;
[youtube]https://www.youtube.com/watch?v=NCTBMcDBVdQ[/youtube]
`

const tags = `
<p>
    <strong>BOLD</strong>
</p>
<p><strong>italic</strong></p>
<h2>h2</h2>
<p>left</p>
<p class="ql-align-center">center</p>
<p class="ql-align-right">right</p>
<p><a href="https://uoc.lv" rel="noopener noreferrer" target="_blank">url</a></p>
<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/_rvSEfHoKSo?showinfo=0"></iframe>
<p><br /></p>
<p><img src="http://localhost:3001/MTY1NTMwMTUyMzI3N3Vua25vd.webp" /></p>

`

const youtubeParser = url => {
	const regExp = /\[youtube\].*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*\[\/youtube\]/
	const match = url.match(regExp)
	const id = match && match[7].length == 11 ? match[7] : false
	if (id === false) {
		return ''
	}
	return `<iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube-nocookie.com/embed/${id}?showinfo=0"></iframe>`
}

const decodeEscapedHTML = str => {
	const thumbnail = (() => {
		const img = /\[imgb\](.*?)\[\/imgb\]/gm.exec(str)

		if (img === null) {
			return ''
		}
		return `<p><img src="${img[1]}" /></p>`
	})()

	return (
		thumbnail +
		str
			.replace(/&amp;/gm, '&')
			.replace(/&lt;/gm, '<')
			.replace(/&gt;/gm, '>')
			.replace(/&quot;/gm, '"')
			.replace(/\[center\](.*?)\[\/center\]/gm, '<p class="ql-align-center">$1</p>')
			.replace(/\[b\](.*?)\[\/b\]/gm, '<strong>$1</strong>')
			.replace(/\[i\](.*?)\[\/i\]/gm, '<em>$1</em>')
			.replace(/\[left\](.*?)\[\/left\]/gm, '<p>$1</p>')
			.replace(/\[right\](.*?)\[\/right\]/gm, '<p class="ql-align-right">$1</p>')
			.replace(/\[big\](.*?)\[\/big\]/gm, '<h2>$1</h2>')
			.replace(/\[youtube\](.*?)\[\/youtube\]/gm, youtubeParser)
			.replace(/\[url="(.*?)"\](.*?)\[\/url\]/gm, '<a href="$1" rel="noopener noreferrer" target="_blank">$2</a>')
			.replace(/\[url\](.*?)\[\/url\]/gm, '<a href="$1" rel="noopener noreferrer" target="_blank">$1</a>')
			.replace(/\[img\](.*?)\[\/img\]/gm, '<p><img src="$1" /></p>')
			.replace(/\[mp3\](.*?)\[\/mp3\]/gm, '')
			.replace(/\[cat\](.*?)\[\/cat\]/gm, '')
			.replace(/\[imgl\](.*?)\[\/imgl\]/gm, '')
			.replace(/\[imgm\](.*?)\[\/imgm\]/gm, '')
			.replace(/\[imgd\](.*?)\[\/imgd\]/gm, '')
			.replace(/\[imgb\](.*?)\[\/imgb\]/gm, '')
			.replace(/\[imgu\](.*?)\[\/imgu\]/gm, '')
			.replace(/<br\/><br\/>/gm, '<br/>')
			.replace(/<br\/>\r\n<br\/>/gm, '<br/>')
			.replace(/<br\/>\n<br\/>/gm, '<br/>')
	)
}

// console.log(text)
// console.log('-----------------------------------------------------------')
// console.log(decodeEscapedHTML(text))

module.exports = decodeEscapedHTML
