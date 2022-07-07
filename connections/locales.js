export const characterMap = {
	ā: 'a',
	č: 'c',
	ē: 'e',
	ģ: 'g',
	ī: 'i',
	ķ: 'k',
	ļ: 'l',
	ņ: 'n',
	š: 's',
	ū: 'u',
	ž: 'z'
}

export const convertToSlug = text =>
	text
		.toLowerCase()
		.replace(/[āčēģīķļņšūž]/gi, v => characterMap[v])
		.replace(/[^\w ]+/g, '')
		.replace(/ +/g, '-')

export const strip = html => {
	const text = html.replaceAll(/<[^>]*>/gi, '')

	if (text.length < 120) return text

	return `${text.slice(0, 120).split(' ').slice(0, -1).join(' ')}...`
}
