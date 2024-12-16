import { ONE, readEntry } from 'utils'

const program = readEntry('entry')

const LEFT_PAREN = String.fromCharCode(0x28)
const RIGHT_PAREN = String.fromCharCode(0x29)
const COMMA = String.fromCharCode(0x2c)

const MUL_INSTRUCTION_LENGHT = 3
const DO_INSTRUCTION_ZERO_BASED_LENGHT = 3
const DONT_INSTRUCTION_ZERO_BASED_LENGHT = 7

function consume_instruction_number(offset: number): number | undefined {
	let number = String()
	for (let g = offset; g < program.length; g++) {
		const posible_digit = Number.parseInt(program[g])
		if (Number.isNaN(posible_digit)) break
		number += posible_digit
	}
	if (number.length) return Number(number)
	return undefined
}

function try_parse_body_mul_instruction(program_offset: number): number | undefined {
	if (program[program_offset] !== LEFT_PAREN) return

	const left_number = consume_instruction_number(program_offset + ONE)
	if (left_number === undefined) return

	const left_number_length = String(left_number).length

	if (program[program_offset + ONE + left_number_length] !== COMMA) return
	const right_number = consume_instruction_number(program_offset + left_number_length + ONE * 2)
	if (right_number === undefined) return

	const right_number_length = String(right_number).length

	const instruction_end_index = program_offset + left_number_length + right_number_length + ONE * 2
	if (program[instruction_end_index] !== RIGHT_PAREN) return

	return left_number * right_number
}

function try_parse_instruction(instruction: string, offset: number): boolean {
	for (let g = 0; g < instruction.length; g++) if (program[offset + g] !== instruction[g]) return false
	return true
}

function parse_all_instructions() {
	let total = 0

	let ignore_next_mul_instruction = false

	for (let g = 0; g < program.length; g++) {
		const is_dont_instruction = try_parse_instruction("don't()", g)

		if (is_dont_instruction) {
			g += DONT_INSTRUCTION_ZERO_BASED_LENGHT
			ignore_next_mul_instruction = true
			continue
		}

		const is_do_instruction = try_parse_instruction('do()', g)

		if (is_do_instruction) {
			g += DO_INSTRUCTION_ZERO_BASED_LENGHT
			if (ignore_next_mul_instruction) ignore_next_mul_instruction = false
			continue
		}

		if (ignore_next_mul_instruction) continue

		const next_is_mul_instruction = try_parse_instruction('mul', g)

		if (next_is_mul_instruction) {
			g += MUL_INSTRUCTION_LENGHT
			const body_mul_instruction = try_parse_body_mul_instruction(g)

			if (body_mul_instruction) total += body_mul_instruction
		}
	}

	return total
}

console.log(parse_all_instructions())
