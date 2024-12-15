import { ONE, readEntry } from 'utils'

type MulInstruction = {
	left_number: number
	right_number: number
}

const entry = readEntry('entry')

const LEFT_PAREN = String.fromCharCode(0x28)
const RIGHT_PAREN = String.fromCharCode(0x29)
const COMMA = String.fromCharCode(0x2c)

const MUL_INSTRUCTION_SUFFIX_LENGHT = 3

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

function parse_next_mul_instruction(program: string, program_offset: number): MulInstruction | undefined {
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

function get_posible_next_body_mul_instruction_index(program: string, program_offset: number): number | undefined {
	const instruction_offset = program.substring(program_offset).search('mul')
	if (instruction_offset > 0) return instruction_offset + MUL_INSTRUCTION_SUFFIX_LENGHT
}

function parse_all_instructions(program: string) {
	let total = 0
	let program_offset = 0

	while (program_offset < program.length) {
		const next_mul_instruction_index = get_posible_next_body_mul_instruction_index(program, program_offset)
		if (next_mul_instruction_index === undefined) break
		program_offset += next_mul_instruction_index
		const next_mul_instruction = parse_next_mul_instruction(program, program_offset)
		if (next_mul_instruction === undefined) continue
		const { left_number, right_number } = next_mul_instruction
		total += left_number * right_number
	}

	return total
}

console.log(parse_all_instructions(entry))
