import heapq
import copy


class TileBoard():
	def __init__(self, board, pos):
		self.board = board
		self.pos = pos
		self.fn = 0
		self.path = []

	def __str__(self):
		string = ""
		for row in range(0, 3):
			for col in range(0, 3):
				if col == 2:
					string += str(self.board[row][col])
				else:
					string += str(self.board[row][col]) + " "
			string += "\n"
		return string

	def __lt__(self, other):
		return self.fn <= other.fn

	def heuristic(self, goal_state):
		goal = dict()
		for row in range(0, 3):
			for col in range(0, 3):
				if goal_state.board[row][col] != 0:
					goal[goal_state.board[row][col]] = (row, col)
		total = 0
		for row_other in range(0, 3):
			for col_other in range(0, 3):
				if self.board[row_other][col_other] != 0:
					num = self.board[row_other][col_other]
					x, y = goal[num]
					total += abs(row_other - x) + abs(col_other - y)
		return total

	def is_goal(self, goal_state):
		return self.board == goal_state.board

	def is_explored(self, explored):
		for node in explored:
			if node.board == self.board:
				return True
		return False

def search(initial, goal):
	frontier = [initial]
	explored = []
	generated = 1
	while True:
		if len(frontier) == 0:
			return (0, None, "")
		node = heapq.heappop(frontier)
		if node.is_goal(goal):
			return node, generated
		explored.append(node)
		left = (node.pos[0], node.pos[1] - 1)
		right = (node.pos[0], node.pos[1] + 1)
		up = (node.pos[0] - 1, node.pos[1])
		down = (node.pos[0] + 1, node.pos[1])
		if left[1] != -1: 
			board = copy.deepcopy(node.board)
			board[left[0]][left[1]], board[left[0]][left[1] + 1] = board[left[0]][left[1] + 1], board[left[0]][left[1]]
			left_tile = TileBoard(board, left)
			if not left_tile.is_explored(explored):
				left_move = node.path + ["L"]
				f_n = len(left_move) + left_tile.heuristic(goal)
				seen = False
				for gen in frontier:
					if gen.board == board:
						if f_n < gen.fn:
							gen.fn = f_n
							gen.path = left_move
							seen = True
							heapq.heapify(frontier)
							break
				if not seen:
					left_tile.fn = f_n
					left_tile.path = left_move
					heapq.heappush(frontier, left_tile)
					generated += 1
		if right[1] != 3: 
			board = copy.deepcopy(node.board)
			board[right[0]][right[1]], board[right[0]][right[1] - 1] = board[right[0]][right[1] - 1], board[right[0]][right[1]]
			right_tile = TileBoard(board, right)
			if not right_tile.is_explored(explored):
				right_move = node.path + ["R"]
				f_n = len(right_move) + right_tile.heuristic(goal)
				seen = False
				for gen in frontier:
					if gen.board == board:
						if f_n < gen.fn:
							gen.fn = f_n
							gen.path = right_move
							seen = True
							heapq.heapify(frontier)
							break
				if not seen:
					right_tile.fn = f_n
					right_tile.path = right_move
					heapq.heappush(frontier, right_tile)
					generated += 1
		if up[0] != -1:
			board = copy.deepcopy(node.board)
			board[up[0]][up[1]], board[up[0] + 1][up[1]] = board[up[0] + 1][up[1]], board[up[0]][up[1]]
			up_tile = TileBoard(board, up)
			if not up_tile.is_explored(explored):
				up_move = node.path + ["U"]
				f_n = len(up_move) + up_tile.heuristic(goal)
				seen = False
				for gen in frontier:
					if gen.board == board:
						if f_n < gen.fn:
							gen.fn = f_n
							gen.path = up_move
							seen = True
							heapq.heapify(frontier)
							break
				if not seen:
					up_tile.fn = f_n
					up_tile.path = up_move
					heapq.heappush(frontier, up_tile)
					generated += 1
		if down[0] != 3: 
			board = copy.deepcopy(node.board)
			board[down[0]][down[1]], board[down[0] - 1][up[1]] = board[down[0] - 1][down[1]], board[down[0]][down[1]]
			down_tile = TileBoard(board, down)
			if not down_tile.is_explored(explored):
				down_move = node.path + ["D"]
				f_n = len(down_move) + down_tile.heuristic(goal)
				seen = False
				for gen in frontier:
					if gen.board == board:
						if f_n < gen.fn:
							gen.fn = f_n
							gen.path = down_move
							seen = True
							heapq.heapify(frontier)
							break
				if not seen:
					down_tile.fn = f_n
					down_tile.path = down_move
					heapq.heappush(frontier, down_tile)
					generated += 1

def main():
	input_file = input("Enter a file name: ")
	file = None
	try:
		file = open(input_file, "r")
	except Exception:
		print("Invalid file name")
		return
	line_count = 0
	board_arr = []
	initial_state = None
	goal_state = None
	blank_pos = (0,0)
	for line in file:
		if line_count == 3:
			initial_state = TileBoard(board_arr, blank_pos)
			board_arr = []
			blank_pos = (0,0)
		else:
			line = line.strip().split()
			for index in range(0, len(line)):
				line[index] = int(line[index])
				if line[index] == 0:
					if line_count < 4:
						blank_pos = (line_count, index)
					else:
						blank_pos = (line_count - 4, index)
			board_arr.append(line)
		line_count += 1
	goal_state = TileBoard(board_arr, blank_pos)
	file.close()
	initial_state.fn = initial_state.heuristic(goal_state)
	node, generated = search(initial_state, goal_state)
	out_name = "Out" + input_file[2:]
	out_file = open(out_name, "w+")
	out_file.write(str(initial_state))
	out_file.write("\n")
	out_file.write(str(goal_state))
	out_file.write("\n")
	out_file.write(str(len(node.path)) + "\n")
	out_file.write(str(generated) + "\n")
	out_file.write(" ".join(node.path) + "\n")
	out_file.close()

main()
