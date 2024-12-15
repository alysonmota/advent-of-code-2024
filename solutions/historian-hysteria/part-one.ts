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

function compute_lists_distances(left_list: Array<number>, right_list: Array<number>): number {
	let total_distance = 0

	while (left_list.length && right_list.length) {
		const [left_smallest_value, left_smallest_index] = get_smallest(left_list)
		const [right_smallest_value, right_smallest_index] = get_smallest(right_list)
		left_list = [...left_list.slice(0, left_smallest_index), ...left_list.slice(left_smallest_index + ONE)]
		right_list = [...right_list.slice(0, right_smallest_index), ...right_list.slice(right_smallest_index + ONE)]
		total_distance += Math.abs(right_smallest_value - left_smallest_value)
	}

	return total_distance
}

console.log(compute_lists_distances(left_list, right_list))
