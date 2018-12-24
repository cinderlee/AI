import numpy as np
import random 
import math

class NeuralNetwork:
    def __init__(self, train_data, test_data, num_hidden):
        self.train_data = train_data
        self.test_data = test_data
        self.num_hidden = num_hidden
        self.hidden_weight = np.random.randn(784, num_hidden)
        self.output_weight = np.random.randn(num_hidden, 5)
        self.alpha = 0.01
        self.hidden_bias = np.ones(num_hidden).reshape(1, num_hidden)
        self.output_bias = np.ones(5).reshape(1, 5)

    def sigmoid(self, x):
    	# sigmoid function of x
        return 1.0 / (1.0 + np.exp(-x))

    def sigmoid_deriv(self, x):
    	# sigmoid derivative of x
        return x * (1 - x)

    def feed_forward(self, input):
    	# feeding forward an input 
    	# first calculate Wk,j * ak + bias for hidden nodes
        hid_val = np.dot(input, self.hidden_weight) + self.hidden_bias
        # sigmoid the values of the hidden nodes
        hidden_layer = self.sigmoid(hid_val)
        # calculate Wj,i * aj + bias for output nodes
        out_val = np.dot(hidden_layer, self.output_weight) + self.output_bias
        # sigmoid values of output nodes
        output_layer = self.sigmoid(out_val)
        return (hidden_layer, output_layer)

    def back_propogate(self, input, label, hidden_layer, output_layer):
        delta_err = (label - output_layer)[0]
        deriv_out = (self.sigmoid_deriv(output_layer))[0]
        delta_i = []
        for d_err, d_out in zip(delta_err, deriv_out):
            delta_i.append(d_err * d_out)
        delta_i = np.array(delta_i).reshape(1, 5)

        o_weight = np.dot(self.alpha, np.dot(hidden_layer.T, delta_i))
        o_bias = np.dot(self.alpha, delta_i)

        deriv_hid = self.sigmoid_deriv(hidden_layer)[0]

        delta_j_lst = np.dot(self.output_weight, delta_i.T).reshape(1, self.num_hidden)[0]

        for del_j in range(self.num_hidden):
            delta_j_lst[del_j] *= deriv_hid[del_j]

        delta_j = np.array(delta_j_lst).reshape(1, self.num_hidden)
        h_weight = np.dot(self.alpha, np.dot(input.T, delta_j))
        h_bias = np.dot(self.alpha, delta_j)
        return [h_weight, h_bias], [o_weight, o_bias]

    def mini_batches(self):
        random.shuffle(self.train_data)
        batch_size = 100
        batches = []
        batch_start = 0
        while batch_start < len(self.train_data):
            batches.append(self.train_data[batch_start:batch_start + batch_size])
            batch_start += batch_size
        return batches

    def training(self):
        batches = self.mini_batches()
        for batch in batches:
            hidden_w_del = np.zeros(self.hidden_weight.shape)
            hidden_b_del = np.zeros(self.hidden_bias.shape)
            output_w_del = np.zeros(self.output_weight.shape)
            output_b_del = np.zeros(self.output_bias.shape)
            for single in batch:
                hidden_layer, output_layer = self.feed_forward(single[0])
                h_change, o_change = self.back_propogate(single[0], single[1], hidden_layer, output_layer)
                hidden_w_del += h_change[0]
                hidden_b_del += h_change[1]
                output_w_del += o_change[0]
                output_b_del += o_change[1]
                self.hidden_weight += np.dot(1/100, hidden_w_del)
                self.hidden_bias += np.dot(1/100, hidden_b_del)
                self.output_weight += np.dot(1/100, output_w_del)
                self.output_bias += np.dot(1/100, output_b_del)

    def squared_error(self, res, lbl):
        delta_err = (res - lbl)[0]
        err_total = 0
        for err in delta_err:
            err_total += err ** 2
        err_total /= 2
        return err_total

    def testing(self):
        results = []
        for test_pix, test_lbl in self.test_data:
            results.append((self.feed_forward(test_pix)[-1], test_lbl))
        
        correct = 0 
        for vals in results:
            if np.argmax(vals[0]) == np.argmax(vals[1]):
                correct += 1

        mean_square_error = 0 
        for res in results:
            mean_square_error += self.squared_error(res[0], res[1])

        mean_square_error /= len(results)
        return correct, mean_square_error, results

    def test_accuracy(self):
        epoch_num = 0
        prev_mse = 0
        mse_diff = 0
        while True:
            self.training()
            correct, mean_square_error, results = self.testing()
            mse_diff = abs(mean_square_error - prev_mse)
            if mse_diff < 0.0001:
                return results
            else:
                prev_mse = mean_square_error
            epoch_num += 1
            print ("Epoch " + str(epoch_num)+ ": "+ str(correct)+' / ' + str(len(self.test_data)) + '   ' + str(mean_square_error)+'   ' \
                           + str(mse_diff))


def open_raw(raw_name):
    file = open(raw_name, "rb")
    byte_file = file.read()
    file.close()
    pixel_lst = []
    count = 0
    lst = []
    for byte in byte_file:
        lst.append(byte / 255)
        count += 1
        if count == 784:
            pixel_lst.append(np.array(lst).reshape(1, 784))
            count = 0
            lst = []
    return pixel_lst

def open_label(label_name):
	# Opens the label file with label_name
    label = open(label_name)
    label_lst = []
    for line in label:
    	# for each label, strip off the \n character
    	# turn the label into a list of numbers
        line = line.strip().split(" ")
        for num in range(0, len(line)):
            line[num] = int(line[num])
        # apppend the list of labels the np array version
        # make sure to reshape it to allow for 
        # matrix multiplication later
        label_lst.append(np.array(line).reshape(1,5))
    label.close()
    return label_lst

def main():
    # open the files 
    train_pixel_lst = open_raw("train_images.raw")
    test_pixel_lst = open_raw("test_images.raw")
    train_label_lst = open_label("train_labels.txt")
    test_label_lst = open_label("test_labels.txt")
    
    train_data = list(zip(train_pixel_lst, train_label_lst))
    test_data = list(zip(test_pixel_lst, test_label_lst))

    confusion_matrix = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
   
    hi = NeuralNetwork(train_data, test_data, 300)
    results = hi.test_accuracy()
    for output, test_lbl in results:
    	out_index = np.argmax(output)
    	lbl_index = np.argmax(test_lbl)
    	confusion_matrix[lbl_index][out_index] += 1

    accuracy = 0
    for x in range(5):
    	print(confusion_matrix[x])
    	accuracy += confusion_matrix[x][x]
    print(accuracy/2561)

main()