import numpy as np
import random


class NeuralNetwork:
    def __init__(self, train_data, test_data, num_hidden, learning_rate):
        self.train_data = train_data
        self.test_data = test_data
        self.num_hidden = num_hidden
        # randomize the weights Wk,j and Wj,i matrices
        self.hidden_weight = np.random.randn(784, num_hidden)
        self.output_weight = np.random.randn(num_hidden, 5)
        self.alpha = learning_rate
        # randomize the biases for hidden layer and output layer
        self.hidden_bias = np.ones(num_hidden).reshape(1, num_hidden)
        self.output_bias = np.ones(5).reshape(1, 5)
        self.batch_size = 100

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

    def back_propagate(self, input, label, hidden_layer, output_layer):
        # calculate y - o where y = label
        delta_err = (label - output_layer)[0]
        # calculate derivative of the activation of the output nodes
        deriv_out = (self.sigmoid_deriv(output_layer))[0]
        delta_i = []
        # calculate err_i * deriv(in_i) - put calculations inside array
        # array is delta_i
        for d_err, d_out in zip(delta_err, deriv_out):
            delta_i.append(d_err * d_out)
        delta_i = np.array(delta_i).reshape(1, 5)
        
        # calculate the changes need to made for output weights and bias
        o_weight = np.dot(self.alpha, np.dot(hidden_layer.T, delta_i))
        o_bias = np.dot(self.alpha, delta_i)
        
        # calculate derivative of hidden
        deriv_hid = self.sigmoid_deriv(hidden_layer)[0]
        # calculate summation of Wj,i * delta_i
        delta_j_lst = np.dot(self.output_weight, delta_i.T).reshape(1, self.num_hidden)[0]

        # calculate delta_j = deriv(in_j) * Wj,i * delta_i
        # turn calculations into array form
        for del_j in range(self.num_hidden):
            delta_j_lst[del_j] *= deriv_hid[del_j]
        delta_j = np.array(delta_j_lst).reshape(1, self.num_hidden)

        # calculate changes need to be made for hidden weights and bias
        h_weight = np.dot(self.alpha, np.dot(input.T, delta_j))
        h_bias = np.dot(self.alpha, delta_j)
        return [h_weight, h_bias], [o_weight, o_bias]

    def mini_batches(self):
        # shuffle the training data
        random.shuffle(self.train_data)
        batches = []
        batch_start = 0
        # divide the training data into batches of size 100 - current batch size
        while batch_start < len(self.train_data):
            batches.append(self.train_data[batch_start:batch_start + self.batch_size])
            batch_start += self.batch_size
        return batches

    def training(self):
        # training uses stochastic gradient descent!
        # make a list of the mini batches
        batches = self.mini_batches()
        # for each batch 
        for batch in batches:
            # store the changes need to be made
            # hidden_w_del = hidden weights delta change
            # hidden_b_del = hidden bias delta change
            # same applies for the output layer
            hidden_w_del = np.zeros(self.hidden_weight.shape)
            hidden_b_del = np.zeros(self.hidden_bias.shape)
            output_w_del = np.zeros(self.output_weight.shape)
            output_b_del = np.zeros(self.output_bias.shape)
            # inside each batch is a training data: 
            # (training image, training label)
            for single in batch:
                # feed forward on the training image
                hidden_layer, output_layer = self.feed_forward(single[0])
                # back propagate using the image, label and the resulting 
                # activated layers
                # h_change, o_change are returned by back propagation
                # h_change = (hidden weights change, hidden bias change)
                h_change, o_change = self.back_propagate(single[0], single[1], hidden_layer, output_layer)
                # store the sum of the changes of all batches 
                # into the delta matrices
                hidden_w_del += h_change[0]
                hidden_b_del += h_change[1]
                output_w_del += o_change[0]
                output_b_del += o_change[1]
            # after accumulating the changes 
            # apply the average of the changes to the weights and bias
            self.hidden_weight += np.dot(1 / self.batch_size, hidden_w_del)
            self.hidden_bias += np.dot(1 / self.batch_size, hidden_b_del)
            self.output_weight += np.dot(1 / self.batch_size, output_w_del)
            self.output_bias += np.dot(1 / self.batch_size, output_b_del)

    def squared_error(self, res, lbl):
        # res = output result, lbl = label
        # take the difference of result - label
        delta_err = (res - lbl)[0]
        err_total = 0
        # for each difference, add the square of it to the total
        for err in delta_err:
            err_total += err ** 2
        return err_total

    def testing(self):
        # list to store the results of feeding forward test data
        results = []
        for test_pix, test_lbl in self.test_data:
            # append (result, label)
            # feed_forward returns hidden layer and output layer
            # result is output layer hence [-1]
            results.append((self.feed_forward(test_pix)[-1], test_lbl))
        
        correct = 0 
        # loop through the results and count how many are correctly predicted
        for vals in results:
            # argmax returns the index of the max value
            # check if argmax of output = argmax of label
            if np.argmax(vals[0]) == np.argmax(vals[1]):
                correct += 1

        mean_square_error = 0 
        # for each result, calculate the squared error 
        for res in results:
            mean_square_error += self.squared_error(res[0], res[1])
        
        # divide the total of squared errors by the amount of results
        # to get the mean square error
        mean_square_error /= len(results)
        return correct, mean_square_error, results

    def test_accuracy(self):
        epoch_num = 0
        prev_mse = 0
        mse_diff = 0
        while True:
            # train the network using the train images and labels
            self.training()
            # test network using the test images and labels
            # retrieve the correct count, mse, and results 
            correct, mean_square_error, results = self.testing()
            # calculate the difference of the mse from last epoch to this one
            mse_diff = abs(mean_square_error - prev_mse)
            # print epoch num, correctly identified images, mse, and mse difference
            print ("Epoch " + str(epoch_num)+ ": "+ str(correct)+' / ' +
                   str(len(self.test_data)) + '\t\t' + str(mean_square_error) + 
                   '\t\t' + str(mse_diff))
            # if the mean square difference is < 0.0001, end the training
            if mse_diff < 0.0001:
                return results
            # else, set the previous mse to the current one and train again
            else:
                prev_mse = mean_square_error
            epoch_num += 1


def open_raw(raw_name):
    # open raw file with raw_name
    file = open(raw_name, "rb")
    byte_file = file.read()
    file.close()
    pixel_lst = []
    # have a counter to counter ever 784 pixels
    count = 0
    lst = []
    # loop through the bytes in the file
    for byte in byte_file:
        # to a sublist, append byte / 255 to prevent overflow
        # error when doing sigmoid later
        lst.append(byte / 255)
        count += 1
        # once hit the 784 counter
        # append the np array form into the 
        # list of pixels of all images
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


def print_confusion(confusion_matrix):
    # prints the confusion matrix nicely
    print("Confusion Matrix: ")
    max_string = 0
    # find the max value in the confusion matrix
    # this would be our reference for spacing 
    for row in confusion_matrix:
        max_num = max(row)
        if max_string < max_num:
            max_string = max_num
    # max string is the length of the max num
    max_string = len(str(max_string))
    confusion_string = " " * max_string + "\t"
    # creating the first table row 
    for i in range(5):
        confusion_string += str(i) + " " * (max_string - 1) + "\t"
    # loop through the confusion matrix and form the rows
    for j in range(5):
        confusion_string += "\n" + str(j) + " " * (max_string - 1) + "\t"
        for row in confusion_matrix[j]:
            num = str(row)
            # number of spaces is len of max num - len of the number itself
            # this fills up the spaces as if each num is same length
            # as the max num 
            spaces = " " * (max_string - len(num))
            confusion_string += num + spaces + "\t"
    print(confusion_string)


def main():
    # open the files 
    train_pixel_lst = open_raw("train_images.raw")
    test_pixel_lst = open_raw("test_images.raw")
    train_label_lst = open_label("train_labels.txt")
    test_label_lst = open_label("test_labels.txt")
    
    # zip the train data and test data
    # pair the train pixels with the train labels, same with test
    train_data = list(zip(train_pixel_lst, train_label_lst))
    test_data = list(zip(test_pixel_lst, test_label_lst))

    # list of amount of hidden nodes
    # loop through each and create neural network of each
    hidden_nodes = [50, 100, 300]
    for hid in hidden_nodes:
        confusion_matrix = [[0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0]]
        print("Number of hidden nodes: " + str(hid))
        print ("Epochs\t\t\t\tMSE\t\t\t\tMSE Difference")
        # input the train data, test data,
        # number of hidden nodes, and learning rate into the network
        neural = NeuralNetwork(train_data, test_data, hid, 0.05)
        accuracy = 0

        # test the neural network and obtain the results
        results = neural.test_accuracy()
        # loop through the results
        # get the index of the max number in the output result and test label

        for output, test_lbl in results:
            out_index = np.argmax(output)
            lbl_index = np.argmax(test_lbl)
            # add 1 to the confusion matrix for the corresponding indices
            confusion_matrix[lbl_index][out_index] += 1

            # if indices match, add 1 to accuracy
            if out_index == lbl_index:
                accuracy += 1

        # print the confusion matrix
        print()
        print_confusion(confusion_matrix)

        # divide by 2561, number of test images
        # and multiply by 100 for percent accuracy
        print()
        accuracy = accuracy / len(test_data) * 100
        print("Accuracy: " + str(accuracy) + "%")
        print()


main()