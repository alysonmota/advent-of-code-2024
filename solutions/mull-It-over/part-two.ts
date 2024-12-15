import { ONE, readEntry } from 'utils'

type MulInstruction = {
	left_number: number
	right_number: number
}

const entry = readEntry('entry')

const LEFT_PAREN = String.fromCharCode(0x28)
const RIGHT_PAREN = String.fromCharCode(0x29)
const COMMA = String.fromCharCode(0x2c)

const MUL_INSTRUCTION_LENGHT = 3
const DO_INSTRUCTION_ZERO_BASED_LENGHT = 3
const DONT_INSTRUCTION_ZERO_BASED_LENGHT = 7

function consume_instruction_number(program: string, offset: number): number | undefined {
	let number = String()
	for (let g = offset; g < program.length; g++) {
		const posible_digit = Number.parseInt(program[g])
		if (Number.isNaN(posible_digit)) break
		number += posible_digit
	}
	if (number.length) return Number(number)
	return undefined
}

function try_parse_body_mul_instruction(program: string, program_offset: number): MulInstruction | undefined {
	if (program[program_offset] !== LEFT_PAREN) return

	const left_number = consume_instruction_number(program, program_offset + ONE)
	if (left_number === undefined) return

	const left_number_length = String(left_number).length

	if (program[program_offset + ONE + left_number_length] !== COMMA) return
	const right_number = consume_instruction_number(program, program_offset + left_number_length + ONE * 2)
	if (right_number === undefined) return

	const right_number_length = String(right_number).length

	const instruction_end_index = program_offset + left_number_length + right_number_length + ONE * 2
	if (program[instruction_end_index] !== RIGHT_PAREN) return

	return { left_number, right_number }
}

function try_parse_instruction(program: string, instruction: string, offset: number): boolean {
	for (let g = 0; g < instruction.length; g++) if (program[offset + g] !== instruction[g]) return false
	return true
}

function parse_all_instructions(program: string) {
	let total = 0

	let last_do_instruction_index: number | undefined
	let last_dont_instruction_index: number | undefined

	for (let g = 0; g < program.length; g++) {
		const is_dont_instruction = try_parse_instruction(program, "don't()", g)
		if (is_dont_instruction) {
			g += DONT_INSTRUCTION_ZERO_BASED_LENGHT
			last_dont_instruction_index = g
		}

		const is_do_instruction = try_parse_instruction(program, 'do()', g)

		if (is_do_instruction) {
			g += DO_INSTRUCTION_ZERO_BASED_LENGHT
			last_do_instruction_index = g
		}

		if (
			(last_dont_instruction_index !== undefined && last_do_instruction_index !== undefined && last_dont_instruction_index > last_do_instruction_index) ||
			(last_dont_instruction_index !== undefined && last_do_instruction_index === undefined)
		)
			continue

		const next_is_mul_instruction = try_parse_instruction(program, 'mul', g)

		if (next_is_mul_instruction) {
			g += MUL_INSTRUCTION_LENGHT
			const body_mul_instruction = try_parse_body_mul_instruction(program, g)

			if (body_mul_instruction === undefined) continue
			total += body_mul_instruction.left_number * body_mul_instruction.right_number
		}
	}

	return total
}

console.log(parse_all_instructions(entry))
