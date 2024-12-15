import { LINE_FEED, ONE, SPACE, readEntry } from 'utils'

const [left_list, right_list] = readEntry('entry')
	.split(LINE_FEED)
	.map((line) => line.split(SPACE).filter(Boolean).map(Number))
	.reduce(
		([left_list, right_list], [left, right]) => {
			left_list.push(left)
			right_list.push(right)
			return [left_list, right_list]
		},
		[[] as number[], [] as number[]],
	)

function get_smallest(list: Array<number>): [smallest_value: number, smallest_index: number] {
	let smallest_index = 0
	let smallest = list[smallest_index]

	for (let g = ONE; g < list.length; g++) {
		if (list[g] < smallest) {
			smallest = list[g]
			smallest_index = g
		}
	}
	return [smallest, smallest_index]
}

function get_item_occourences_in_list(item: number, list: Array<number>): number {
	let occourences = 0
	for (let g = 0; g < list.length; g++) if (list[g] === item) occourences++
	return occourences
}

function compute_similarity_score(left_list: Array<number>, right_list: Array<number>): number {
	let total_similarity_score = 0

	for (let g = 0; g < left_list.length; g++) {
		const item_occourences = get_item_occourences_in_list(left_list[g], right_list)
		total_similarity_score += left_list[g] * item_occourences
	}

	return total_similarity_score
}

console.log(compute_similarity_score(left_list, right_list))
