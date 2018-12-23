import numpy as np
import random 
import math

class NeuralNetwork:
    def __init__(self, train, train_label, test_label, num_hidden):
        self.train = np.array(train).reshape(1, 784)
        self.train_label = np.array(train_label).reshape(1, 5)
        self.test_label = np.array(test_label).reshape(1, 5)
        self.num_hidden = num_hidden
        self.hidden_weight = np.random.randn(784, num_hidden)
        self.output_weight = np.random.randn(num_hidden, 5)
        self.alpha = 0.01

    def sigmoid(self, x):
        return 1.0 / (1.0 + np.exp(-x))

    def sigmoid_deriv(self, x):
        return self.sigmoid(x) * (1 - self.sigmoid(x))

    def feed_forward(self):
        self.hid_val = np.dot(self.train, self.hidden_weight) 
        self.hidden_layer = self.sigmoid(self.hid_val)
        self.out_val = np.dot(self.hidden_layer, self.output_weight)
        self.output_layer = self.sigmoid(self.out_val)

    def back_propogate(self):
        delta_err = (self.train_label - self.output_layer)[0]
        deriv_out = (self.sigmoid_deriv(self.out_val))[0]
        delta_i_lst = []
        for i in range(len(delta_err)):
            delta_i_lst.append(delta_err[i] * deriv_out[i])
        delta_i = np.array(delta_i_lst).reshape(1, 5)

        self.output_weight += np.dot(self.alpha, np.dot(self.hidden_layer.T, delta_i))

        deriv_hid = self.sigmoid_deriv(self.hid_val)[0]

        delta_j_lst = np.dot(self.output_weight, delta_i.T).reshape(1,50)[0]

        for del_j in range(self.num_hidden):
            delta_j_lst[del_j] *= deriv_hid[del_j]

        delta_j = np.array(delta_j_lst).reshape(1, 50)
        self.hidden_weight += np.dot(self.alpha, np.dot(self.train.T, delta_j))

    def squared_error(self):
        delta_err = (self.test_label - self.output_layer)[0]
        err_total = 0
        for err in delta_err:
            err_total += err ** 2
        err_total /= 2
        return err_total

    def training(self):
        prev_error = 0
        while True:
            self.feed_forward()
            squared_err = self.squared_error()
            self.back_propogate()
            if math.fabs(prev_error - squared_err) < 0.00001:
                break
            prev_error = squared_err
        return self.output_layer


def main():
    file = open("train_images.raw", "rb")
    byte_file = file.read()
    file.close()
    pixel_lst = []
    count = 0
    lst = []
    for byte in byte_file:
        lst.append(byte / 255)
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

    confusion_matrix = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    for times in range(100):
    	# get the image 
        pixel = pixel_lst[times]
        # get the train label
        train_lbl = train_label_lst[times]
        # get the test label
        test_lbl = test_label_lst[times]
        hi = NeuralNetwork(pixel, train_lbl, test_lbl, 50)
        # look for 1 in the test_label
        test_index = test_lbl.index(1)
        final_output = list(hi.training()[0])
        max_num = max(final_output)
        # get the index of the max value in the output 
        final_index = final_output.index(max_num)
        confusion_matrix[test_index][final_index] += 1
    print(confusion_matrix)
    accuracy = 0
    for i in range(5):
    	accuracy += confusion_matrix[i][i]
    accuracy /= 100
    print(accuracy)

main()