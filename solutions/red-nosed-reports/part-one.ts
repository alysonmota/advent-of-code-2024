import { LINE_FEED, ONE, SPACE, readEntry } from 'utils'

const entry = readEntry('entry')
	.split(LINE_FEED)
	.map((report) => report.split(SPACE).map(Number))

const MIN_REPORT_DIFF = ONE
const MAX_REPORT_DIFF = 3

function is_safe_report(report: Array<number>) {
	/*
    ZERO = decrease
    ONE  = increase
  */
	let report_type: number | undefined = undefined

	for (let r = 0; r < report.length; r++) {
		const next_report_item = report[r + ONE]

		if (next_report_item) {
			if (report_type === undefined) {
				if (next_report_item - report[r] > 0) report_type = ONE
				else report_type = 0
			}

			if ((next_report_item > report[r] && report_type === 0) || !!(next_report_item < report[r] && report_type === ONE)) return false

			if (
				next_report_item === report[r] ||
				Math.abs(report[r] - next_report_item) > MAX_REPORT_DIFF ||
				Math.abs(report[r] - next_report_item) < MIN_REPORT_DIFF
			)
				return false
			continue
		}
		break
	}

	return true
}

function compute_safe_reports(reports: Array<Array<number>>): number {
	let safe_reports = 0

	for (let e = 0; e < entry.length; e++) {
		const is_safe = is_safe_report(entry[e])
		if (is_safe) safe_reports++
	}

	return safe_reports
}

console.log(compute_safe_reports(entry))
