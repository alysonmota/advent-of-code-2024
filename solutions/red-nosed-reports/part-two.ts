import { LINE_FEED, ONE, SPACE, readEntry } from 'utils'

const entry = readEntry('entry')
	.trim()
	.split(LINE_FEED)
	.map((report) => report.split(SPACE).map(Number))

const MIN_REPORT_DIFF = ONE
const MAX_REPORT_DIFF = 3

function is_safe_report(report: Array<number>): boolean {
	/*
    ZERO = decreasing
    ONE  = increasing
  */
	let report_type: number | undefined = undefined

	for (let r = 0; r < report.length; r++) {
		const next_report_item = report[r + ONE]

		if (next_report_item) {
			if (report_type === undefined) {
				if (next_report_item - report[r] > 0) report_type = ONE
				else report_type = 0
			}

			const is_changed_report_type = (next_report_item > report[r] && report_type === 0) || (next_report_item < report[r] && report_type === ONE)
			const levels_diff_is_not_valid =
				next_report_item === report[r] || Math.abs(report[r] - next_report_item) > MAX_REPORT_DIFF || Math.abs(report[r] - next_report_item) < MIN_REPORT_DIFF

			if (is_changed_report_type || levels_diff_is_not_valid) return false
			continue
		}
		break
	}

	return true
}

function compute_safe_reports(reports: Array<Array<number>>): number {
	let safe_reports = 0

	for (let r = 0; r < reports.length; r++) {
		const is_safe = is_safe_report(reports[r])
		if (is_safe) {
			safe_reports++
		} else {
			for (let g = 0; g < reports[r].length; g++) {
				const new_report = [...reports[r].slice(0, g), ...reports[r].slice(g + ONE)]
				const is_safe_new_report = is_safe_report(new_report)
				if (is_safe_new_report) {
					safe_reports++
					break
				}
			}
		}
	}

	return safe_reports
}

console.log(compute_safe_reports(entry))
