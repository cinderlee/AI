import heapq
import copy

# Tile Board class
# takes in a board and position of the blank space in board
class TileBoard():
    def __init__(self, board, pos):
        self.board = board
        self.pos = pos
        self.fn = 0
        self.path = []

    # string representation of board
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

    # less than function for heap comparisons
    def __lt__(self, other):
        return self.fn <= other.fn

    # Manhattan distance 
    def heuristic(self, goal_state):
        goal = dict()
        # create a dictionary of goal elements to tuple (x,y) location
        for row in range(0, 3):
            for col in range(0, 3):
                if goal_state.board[row][col] != 0:
                    goal[goal_state.board[row][col]] = (row, col)
        # sum of Manhattan distances
        total = 0
        # compare current element locations to the location in tuple
        # retrieve the difference
        for row_other in range(0, 3):
            for col_other in range(0, 3):
                if self.board[row_other][col_other] != 0:
                    num = self.board[row_other][col_other]
                    x, y = goal[num]
                    total += abs(row_other - x) + abs(col_other - y)
        # return the sum
        return total

    # check if state is goal state
    def is_goal(self, goal_state):
        return self.board == goal_state.board

    # check if state is already explored
    def is_explored(self, explored):
        for node in explored:
            if node.board == self.board:
                return True
        return False

# making the up, down, left, right move 
# returns whether or not the node was generated
def make_move(tile, explored, frontier):
    # check if tile is already explored
    if not tile.is_explored(explored):
        seen = False
        # check if tile is in frontier
        for gen in frontier:
            # if tile in frontier
            if gen.board == tile.board:
                # check whether current cost is less
                # than cost of node in frontier
                # if so, update the fn and path
                # heapify heap again to reorder the heap correctly
                if tile.fn < gen.fn:
                    gen.fn = tile.fn
                    gen.path = tile.path
                    seen = True
                    heapq.heapify(frontier)
                    break
        # if tile not in frontier, push node
        if not seen:
            heapq.heappush(frontier, tile)
            return True
    return False

def search(initial, goal):
    # initilize frontier to have initial state
    # generated = 1 to include root node
    # explored is currently empty
    frontier = [initial]
    explored = []
    generated = 1

    # loop do
    while True:
        # if frontier is empty, return None as node
        if len(frontier) == 0:
            return None, generated
        # pop off node with least function value
        node = heapq.heappop(frontier)
        # check if node is goal node
        # if goal node, return the node and number of generated nodes
        if node.is_goal(goal):
            return node, generated
        # otherwise, add node to explored 
        explored.append(node)

        # create left, right, up, down positions of blank space for next move
        left = (node.pos[0], node.pos[1] - 1)
        right = (node.pos[0], node.pos[1] + 1)
        up = (node.pos[0] - 1, node.pos[1])
        down = (node.pos[0] + 1, node.pos[1])

        # if left position of next blank space is valid
        if left[1] != -1: 
            # make copy of board
            # make the left swap
            board = copy.deepcopy(node.board)
            board[left[0]][left[1]], board[left[0]][left[1] + 1] = board[left[0]][left[1] + 1], board[left[0]][left[1]]
            # create the Tile Board node for the left swap 
            # append left to path 
            # calculate fn
            left_tile = TileBoard(board, left)
            left_tile.path = node.path + ["L"]
            left_tile.fn = len(left_tile.path) + left_tile.heuristic(goal)
            # check whether node was generated 
            if make_move(left_tile, explored, frontier):
                generated += 1
        # if right position of next blank space is valid
        if right[1] != 3: 
            # make copy of board
            # make the right swap
            board = copy.deepcopy(node.board)
            board[right[0]][right[1]], board[right[0]][right[1] - 1] = board[right[0]][right[1] - 1], board[right[0]][right[1]]
            # create the Tile Board node for the right swap 
            # append right to path 
            # calculate fn
            right_tile = TileBoard(board, right)
            right_tile.path = node.path + ["R"]
            right_tile.fn = len(right_tile.path) + right_tile.heuristic(goal)
            # check whether node was generated 
            if make_move(right_tile, explored, frontier):
                generated += 1
        # if up position of next blank space is valid
        if up[0] != -1:
            # make copy of board
            # make the up swap
            board = copy.deepcopy(node.board)
            board[up[0]][up[1]], board[up[0] + 1][up[1]] = board[up[0] + 1][up[1]], board[up[0]][up[1]]
            # create the Tile Board node for the up swap 
            # append up to path 
            # calculate fn
            up_tile = TileBoard(board, up)
            up_tile.path = node.path + ["U"]
            up_tile.fn = len(up_tile.path) + up_tile.heuristic(goal)
            # check whether node was generated 
            if make_move(up_tile, explored, frontier):
                generated += 1
        # if down position of next blank space is valid
        if down[0] != 3:
            # make copy of board
            # make the down swap
            board = copy.deepcopy(node.board)
            board[down[0]][down[1]], board[down[0] - 1][up[1]] = board[down[0] - 1][down[1]], board[down[0]][down[1]]
            # create the Tile Board node for the down swap 
            # append down to path 
            # calculate fn
            down_tile = TileBoard(board, down)
            down_tile.path = node.path + ["D"]
            down_tile.fn = len(down_tile.path) + down_tile.heuristic(goal)
            # check whether node was generated 
            if make_move(down_tile, explored, frontier):
                generated += 1

def read_file(file_nm):
    file = None
    # attempt to open file
    # if file not found, report to user
    try:
        file = open(file_nm, "r")
    except Exception:
        print("Invalid file name")
        return
    line_count = 0
    board_arr = []
    initial_state = None
    goal_state = None
    blank_pos = (0,0)
    # read the file lines
    for line in file:
        # if at the space between initial and goal
        # create the initial_state board
        if line_count == 3:
            initial_state = TileBoard(board_arr, blank_pos)
            board_arr = []
            blank_pos = (0,0)
        # otherwise create the board array
        else:
            line = line.strip().split()
            for index in range(0, len(line)):
                # for each element, take the int of the ascii
                line[index] = int(line[index])
                # retrieve position of blank space if seen
                if line[index] == 0:
                    if line_count < 4:
                        blank_pos = (line_count, index)
                    else:
                        blank_pos = (line_count - 4, index)
            board_arr.append(line)
        line_count += 1
    file.close()
    # after reading, create the goal state with the board
    # this was not created inside the loop! 
    goal_state = TileBoard(board_arr, blank_pos)
    # set the fn value of initial to the heuristic value
    # path cost of initial is 0 
    initial_state.fn = initial_state.heuristic(goal_state)
    # return initial and goal states
    return initial_state, goal_state

# write the output file 
def write_file(file_nm, initial, goal, result):
    # separate the results into node returned and generated 
    node, generated = result[0], result[1]

    # write the file with initial and goal state
    out_file = open(file_nm, "w+")
    out_file.write(str(initial))
    out_file.write("\n")
    out_file.write(str(goal))
    out_file.write("\n")

    # if search failed, write failure
    if node is None:
        out_file.write("Failure\n")
    # otherwise, write the depth, gen nodes, and the path
    else:
        out_file.write(str(len(node.path)) + "\n")
        out_file.write(str(generated) + "\n")
        out_file.write(" ".join(node.path) + "\n")
    out_file.close()

def main():
    # ask user for file name
    input_file = input("Enter a file name: ")
    # retrieve the initial and goal states from reading the file
    initial_state, goal_state = read_file(input_file)
    initial_state.fn = initial_state.heuristic(goal_state)
    result = search(initial_state, goal_state)
    out_name = "Out" + input_file[2:]
    write_file(out_name, initial_state, goal_state, result)

main()
