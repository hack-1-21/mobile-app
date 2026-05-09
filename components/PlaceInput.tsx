import {
  fetchPlaceLocation,
  fetchPlacePredictions,
  PlacePrediction,
} from "@/hooks/usePlacesAutocomplete";
import { colorTokens, fontFamily } from "@/constants/tokens";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type PlaceSelection = {
  label: string;
  location: { lat: number; lng: number } | null;
};

type Props = {
  value: PlaceSelection;
  onChange: (sel: PlaceSelection) => void;
  placeholder?: string;
  prefixOptions?: PlaceSelection[];
};

export function PlaceInput({ value, onChange, placeholder, prefixOptions }: Props) {
  const [text, setText] = useState(value.label);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(value.label);
  }, [value.label]);

  const handleChange = (t: string) => {
    setText(t);
    onChange({ label: t, location: null });
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const preds = await fetchPlacePredictions(t);
      setPredictions(preds);
      setLoading(false);
    }, 300);
  };

  const handleFocus = () => {
    if (blurRef.current) clearTimeout(blurRef.current);
    setOpen(true);
  };

  const handleBlur = () => {
    blurRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleSelectPrefix = (opt: PlaceSelection) => {
    setText(opt.label);
    setPredictions([]);
    setOpen(false);
    onChange(opt);
  };

  const handleSelectPrediction = async (pred: PlacePrediction) => {
    setText(pred.description);
    setPredictions([]);
    setOpen(false);
    const location = await fetchPlaceLocation(pred.placeId);
    onChange({ label: pred.description, location });
  };

  const showPrefix = prefixOptions && prefixOptions.length > 0 && text.trim().length < 2;
  const showDropdown = open && (showPrefix || predictions.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colorTokens.mutedText}
        />
        {loading && (
          <ActivityIndicator size="small" color={colorTokens.tertiary} style={styles.spinner} />
        )}
      </View>
      {showDropdown && (
        <View style={styles.dropdown}>
          {showPrefix &&
            prefixOptions!.map((opt, i) => (
              <TouchableOpacity
                key={`prefix-${i}`}
                style={[styles.item, i < prefixOptions!.length - 1 && styles.separator]}
                onPress={() => handleSelectPrefix(opt)}
              >
                <Text style={styles.itemText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          {predictions.map((pred, i) => (
            <TouchableOpacity
              key={pred.placeId}
              style={[styles.item, i < predictions.length - 1 && styles.separator]}
              onPress={() => handleSelectPrediction(pred)}
            >
              <Text style={styles.itemText} numberOfLines={2}>
                {pred.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    backgroundColor: colorTokens.darkBackground,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: colorTokens.tertiary,
    ...fontFamily.kiwiMaruRegular,
    fontSize: 15,
  },
  spinner: {
    marginLeft: 8,
  },
  dropdown: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: colorTokens.hudPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorTokens.primaryForeground,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 20,
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: colorTokens.blueToneDown,
  },
  itemText: {
    color: colorTokens.hudText,
    ...fontFamily.kiwiMaruRegular,
    fontSize: 13,
  },
});
