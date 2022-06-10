export const stdTimezoneOffset = date => {
	const jan = new Date(date.getFullYear(), 0, 1)
	const jul = new Date(date.getFullYear(), 6, 1)
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
}

export const isDstObserved = date => {
	return date.getTimezoneOffset() < stdTimezoneOffset(date)
}

export const localesOptionsShort = {year: '2-digit', month: '2-digit', day: '2-digit'}
export const localesOptions = {
	hour12: false,
	year: '2-digit',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit'
}
export const localesOptionsFull = {
	hour12: false,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit'
}
export const locales = 'lv-LV'

export const toLocaleDateShort = dateString => {
	if (isNaN(dateString) === false || typeof dateString === 'undefined') {
		return 'nav noteikts'
	}
	return new Date(dateString).toLocaleDateString(locales, localesOptionsShort)
}

export const toLocaleDate = dateString => {
	if (isNaN(dateString) === false || typeof dateString === 'undefined') {
		return 'nav noteikts'
	}
	return new Date(dateString).toLocaleDateString(locales, localesOptions)
}

export const toLocaleDateFull = dateString => {
	if (isNaN(dateString) === false || typeof dateString === 'undefined') {
		return 'nav noteikts'
	}
	return new Date(dateString).toLocaleDateString(locales, localesOptionsFull)
}

export const fromLocalDateShort = dateString => {
	if (/^\d{2}\.\d{2}\.\d{2}$/.test(dateString) !== true) {
		return 'nav noteikts'
	}
	const [DD, MM, YY] = dateString.split('.')
	return new Date(Date.UTC(`20${YY}`, Number(MM) - 1, DD)).toUTCString()
}

export const getWeekNumber = () => {
	const d = new Date()
	d.setHours(0, 0, 0)
	d.setDate(d.getDate() + 4 - (d.getDay() || 7))
	return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7)
}

export const getYearWeekNumber = () => {
	return `${new Date().getUTCFullYear()}-${getWeekNumber()}`
}

export const weekNumber = d => {
	d.setHours(0, 0, 0)
	d.setDate(d.getDate() + 4 - (d.getDay() || 7))
	return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7)
}

export const yearWeekNumber = d => {
	const date = new Date(d)
	return `${date.getUTCFullYear()}-${weekNumber(date)}`
}

export const getDateFromWeek = (w, y) => {
	const simple = new Date(y, 0, 1 + (w - 1) * 7)
	if (simple.getUTCDay() <= 4) {
		simple.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 2)
	}
	simple.setUTCDate(simple.getUTCDate() + 9 - simple.getUTCDay())
	return simple.toISOString()
}

export const getWeekList = () => {
	let result = []
	for (let i = 1; i !== 54; ++i) result.push(`${new Date().getFullYear()}-${String(i).padStart(2, '0')}`)
	for (let i = 1; i !== 10; ++i) result.push(`${new Date().getFullYear() + 1}-${String(i).padStart(2, '0')}`)
	return result
}

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
