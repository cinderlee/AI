import numpy as np
import random 


class NeuralNetwork:
	def __init__(self, train, test, num_hidden):
		self.train = train
		self.test = test
		self.num_hidden = num_hidden
		self.hidden_weight = np.random.randn(784,num_hidden)
		self.output_weight = np.random.randn(num_hidden, 5)

	def sigmoid(self, x):
		return 1 / (1 + np.exp(-x))

	def sigmoid_deriv(self, x):
		return x * (1 - x)

	def forward(self):
		hid_val = np.dot(self.train, self.hidden_weight) 
		sig = self.sigmoid(hid_val)
		out_val = np.dot(sig, self.output_weight)

	def back(self)
	


def neural(num_hidden, train_lst, test_lst):
	hidden_weights = []
	output_weights = []
	for i in range(50):
		hidden_weights.append(random.random())
	for j in range(5):
		output_weights.append(random.random())
	hidden_total = []
	for hid in hidden_weights:
		total = 0
		for num in train_lst:
			total += num * hid
		hidden_total.append(sigmoid(total))
	output_total = []
	for out in output_weights:
		total = 0
		for hid in hidden_total:
			total += hid * out
		output_total.append(sigmoid(total))
	print(output_total, hidden_total)

def main():
	file = open("train_images.raw", "rb")
	byte_file = file.read()
	file.close()
	pixel_lst = []
	count = 0
	lst = []
	for byte in byte_file:
		lst.append(byte/255)
		count += 1
		if count == 784:
			pixel_lst.append(lst)
			count = 0
			lst = []
	# 0 1 2 3 4
	train_label = open("train_labels.txt")
	train_label_lst = []
	for line in train_label:
		line = line.strip().split(" ")
		for num in range(0, len(line)):
			line[num] = int(line[num])
		train_label_lst.append(line)
	train_label.close()

	test_label = open("test_labels.txt")
	test_label_lst = []
	for line in test_label:
		line = line.strip().split(" ")
		for num in range(0, len(line)):
			line[num] = int(line[num])
		test_label_lst.append(line)
	test_label.close()

	hidden = np.random.randn(784,50)
	outie = np.random.randn(50, 5)
	pixel = pixel_lst[0]
	lst1 = train_label_lst[0]
	#print(np.dot(hidden, lst1))
	lst1 = np.array(lst1)

	pixel = np.array(pixel)
	stuff = np.dot(pixel, hidden)

	x = 1 / (1 + np.exp(-stuff))
	
	outster = np.dot(x, outie)
	print(outster)
	print(lst1)
	print(lst1 - outster)

main()