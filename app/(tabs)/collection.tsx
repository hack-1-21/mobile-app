import { NextArrowIcon } from "@/components/icons/NextArrowIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { PrevArrowIcon } from "@/components/icons/PrevArrowIcon";
import PlayerHUD from "@/components/PlayerHUD";
import { colorTokens, fontFamily, fontSize, radius, spacing } from "@/constants/tokens";
import { useGardenHistory } from "@/hooks/useGardenHistory";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PAGE_SIZE = 9;

function formatGardenDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

export default function Collection() {
  const { data: collectionData } = useGardenHistory();
  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(collectionData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const currentCollectionData = useMemo(
    () => collectionData.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [collectionData, safePage],
  );

  const selectedItem = selectedIndex !== null ? (collectionData[selectedIndex] ?? null) : null;

  const handlePreviousPage = () => {
    if (safePage === 1) return;
    setPage(safePage - 1);
  };

  const handleNextPage = () => {
    if (safePage === totalPages) return;
    setPage(safePage + 1);
  };

  const handlePreviousItem = () => {
    if (selectedIndex === null || selectedIndex <= 0) return;
    setSelectedIndex(selectedIndex - 1);
  };

  const handleNextItem = () => {
    if (selectedIndex === null || selectedIndex >= collectionData.length - 1) return;
    setSelectedIndex(selectedIndex + 1);
  };

  const handleBackToCollection = () => {
    if (selectedIndex !== null) {
      setPage(Math.floor(selectedIndex / PAGE_SIZE) + 1);
    }
    setSelectedIndex(null);
  };

  return (
    <View style={styles.container}>
      <PlayerHUD />
      <View style={styles.wrapper}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>箱庭図鑑</Text>
          <View style={[styles.frameDecoration, styles.frameDecoration1]} />
          <View style={[styles.frameDecoration, styles.frameDecoration2]} />
          <View style={[styles.frameDecoration, styles.frameDecoration3]} />
          <View style={[styles.frameDecoration, styles.frameDecoration4]} />
        </View>

        <View style={styles.content}>
          <View style={styles.collectionContainer}>
            <LinearGradient
              colors={["#7190E4", "#DBDFFF"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[
                styles.collectionContainerContent,
                selectedItem && styles.collectionContainerContentDetail,
              ]}
            >
              {selectedItem ? (
                <View style={styles.detailContainer}>
                  <View style={styles.detailImageRow}>
                    <TouchableOpacity
                      onPress={handlePreviousItem}
                      disabled={selectedIndex === null || selectedIndex <= 0}
                      style={[styles.detailArrowButton, selectedIndex === null || selectedIndex <= 0 ? styles.detailArrowButtonDisabled : styles.detailArrowButtonActive, styles.detailArrowButtonLeft]}
                      activeOpacity={0.7}
                    >
                      <PrevArrowIcon
                        size={36}
                        color={
                          selectedIndex === null || selectedIndex <= 0
                            ? colorTokens.mutedText
                            : colorTokens.background
                        }
                      />
                    </TouchableOpacity>
                    <Image
                      source={{ uri: selectedItem.image_url }}
                      style={styles.detailImage}
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      onPress={handleNextItem}
                      disabled={
                        selectedIndex === null || selectedIndex >= collectionData.length - 1
                      }
                      style={[styles.detailArrowButton, selectedIndex === null || selectedIndex >= collectionData.length - 1 ? styles.detailArrowButtonDisabled : styles.detailArrowButtonActive, styles.detailArrowButtonRight]}
                      activeOpacity={0.7}
                    >
                      <NextArrowIcon
                        size={36}
                        color={
                          selectedIndex === null || selectedIndex >= collectionData.length - 1
                            ? colorTokens.mutedText
                            : colorTokens.background
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.detailDateText}>
                    {formatGardenDate(selectedItem.completed_at ?? selectedItem.created_at)}
                    の箱庭
                  </Text>
                </View>
              ) : (
                <View style={styles.collectionRow}>
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.collectionRowContent}>
                      {Array.from({ length: Math.ceil(PAGE_SIZE / 3) }).map((_, colIndex) => {
                        const item =
                          currentCollectionData[rowIndex * Math.ceil(PAGE_SIZE / 3) + colIndex];
                        const hasImage = Boolean(item && item.image_url);
                        const globalIndex =
                          (safePage - 1) * PAGE_SIZE +
                          rowIndex * Math.ceil(PAGE_SIZE / 3) +
                          colIndex;
                        return (
                          <TouchableOpacity
                            key={colIndex}
                            style={styles.collectionContent}
                            onPress={() => hasImage && setSelectedIndex(globalIndex)}
                            disabled={!hasImage}
                            activeOpacity={0.7}
                          >
                            {hasImage && item ? (
                              <Image
                                source={{ uri: item.image_url }}
                                style={styles.collectionImage}
                                resizeMode="cover"
                              />
                            ) : (
                              <PlusIcon size={28} color={colorTokens.blueToneDown} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>
          </View>
          {selectedItem ? (
            <TouchableOpacity
              onPress={handleBackToCollection}
              activeOpacity={0.8}
              style={styles.backButtonShadow}
            >
              <Text style={styles.backButtonText}>図鑑に戻る</Text>
            </TouchableOpacity>
          ) : (
            <LinearGradient
              colors={["#7190E4", "#DBDFFF"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.paginationContainer}
            >
              <TouchableOpacity
                onPress={handlePreviousPage}
                disabled={safePage === 1}
                style={[styles.paginationArrowButton, styles.paginationArrowButtonActive]}
              >
                <PrevArrowIcon
                  size={36}
                  color={safePage === 1 ? colorTokens.mutedText : colorTokens.background}
                />
              </TouchableOpacity>
              <View style={styles.paginationTextContainer}>
                <Text style={styles.paginationText}>{safePage}</Text>
              </View>
              <TouchableOpacity
                onPress={handleNextPage}
                disabled={safePage === totalPages}
                style={[styles.paginationArrowButton, styles.paginationArrowButtonActive]}
              >
                <NextArrowIcon
                  size={36}
                  color={safePage === totalPages ? colorTokens.mutedText : colorTokens.background}
                />
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.darkBackground,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 24,
    gap: 24,
  },
  content: {
    flex: 1,
    gap: 20,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorTokens.tertiary,
    borderRadius: radius.md,
    borderWidth: 5,
    borderColor: colorTokens.hakoniwaBorder,
    paddingHorizontal: 30,
    paddingVertical: 2,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    position: "relative",
  },
  frameDecoration: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: colorTokens.hakoniwaBorder,
    borderRadius: 50,
  },
  frameDecoration1: {
    top: -2,
    left: -2,
  },
  frameDecoration2: {
    top: -2,
    right: -2,
  },
  frameDecoration3: {
    bottom: -2,
    left: -2,
  },
  frameDecoration4: {
    bottom: -2,
    right: -2,
  },
  titleText: {
    color: colorTokens.primary,
    fontSize: fontSize.maximum,
    ...fontFamily.kiwiMaruRegular,
  },
  collectionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colorTokens.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  collectionContainerContent: {
    flex: 1,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: "100%",
    height: "100%",
  },
  collectionContainerContentDetail: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  collectionRow: {
    gap: 16,
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  collectionRowContent: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  collectionContent: {
    height: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.lg,
    backgroundColor: colorTokens.secondary,
    shadowColor: colorTokens.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  collectionImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.lg,
  },
  detailContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  detailImageRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative"
  },
  detailArrowButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: "-50%" }],
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    width: 40,
    height: 40,
    borderRadius: radius.full,
    zIndex: 100,
  },
  detailArrowButtonDisabled: {
    backgroundColor: "#767676",
  },
  detailArrowButtonActive: {
    backgroundColor: colorTokens.primaryForeground,
  },
  detailArrowButtonLeft: {
    left: 0,
  },
  detailArrowButtonRight: {
    right: 0,
  },
  detailImage: {
    flex: 1,
    height: "100%",
    borderRadius: radius.lg,
  },
  detailDateText: {
    color: colorTokens.foreground,
    fontSize: fontSize.large,
    textAlign: "center",
    ...fontFamily.kiwiMaruMedium,
    backgroundColor: colorTokens.background,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: 16,
    borderRadius: radius.lg,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  paginationTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorTokens.primaryForeground,
    width: 35,
    height: 35,
    borderRadius: radius.full,
  },
  paginationText: {
    color: colorTokens.background,
    fontSize: fontSize.maximum,
    textAlign: "center",
    ...fontFamily.kiwiMaruRegular,
    lineHeight: 30,
  },
  paginationArrowButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  paginationArrowButtonActive: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  backButtonShadow: {
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: colorTokens.primaryForeground,
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: colorTokens.background,
    fontSize: fontSize.large,
    textAlign: "center",
    ...fontFamily.kiwiMaruRegular,
  },
});
