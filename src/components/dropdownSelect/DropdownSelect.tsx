import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { width } from '../../config/constants';

interface DropdownSelectProps {
  placeholder: string;
  value?: string;
  options?: string[];
  onSelect?: (value: string) => void;
  onPress?: () => void;
  otherStyles?: any;
}

const DropdownSelect = ({
  placeholder,
  value,
  options = [],
  onSelect,
  onPress,
  otherStyles,
}: DropdownSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Default options if not provided
  const defaultOptions: string[] =
    placeholder.toLowerCase() === 'guests'
      ? ['1', '2', '3', '4', '5', '6', '7', '8+']
      : placeholder.toLowerCase() === 'rooms'
      ? ['1', '2', '3', '4', '5+']
      : placeholder.toLowerCase().includes('room type')
      ? ['Single', 'Double', 'Twin', 'Suite', 'Deluxe']
      : [];

  const dropdownOptions = options.length > 0 ? options : defaultOptions;

  const handleToggle = () => {
    if (onPress) {
      onPress();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (onSelect) {
      onSelect(selectedValue);
    }
    setIsOpen(false);
  };

  return (
    <View style={[styles.wrapper, otherStyles]}>
      <TouchableOpacity
        style={[styles.container, otherStyles]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, value && styles.textWithValue]}>
          {value || placeholder}
        </Text>
        <ChevronDown
          size={20}
          color={colors.c_666666}
          style={[isOpen && styles.chevronRotated]}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={styles.dropdownContainer}
            onStartShouldSetResponder={() => true}
          >
            <FlatList
              data={dropdownOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownSelect;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.c_F3F3F3,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.normal,
    color: colors.c_666666,
    flex: 1,
  },
  textWithValue: {
    color: colors.black,
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: 300,
    width: width * 0.8,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  optionItemSelected: {
    backgroundColor: colors.c_F3F3F3,
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.normal,
    color: colors.black,
  },
  optionTextSelected: {
    fontFamily: fonts.bold,
    color: colors.c_0162C0,
  },
  separator: {
    height: 1,
    backgroundColor: colors.c_F3F3F3,
    marginHorizontal: 20,
  },
});
