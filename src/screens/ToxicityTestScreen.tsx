import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const QUESTIONS = [
  {
    id: 1,
    question: "Do you get secretly happy when a friend fails?",
    options: ["Never", "Sometimes", "Often"],
    weights: [0, 5, 10]
  },
  {
    id: 2,
    question: "How do you react to criticism?",
    options: ["Reflect on it", "Get defensive", "Attack back"],
    weights: [0, 5, 10]
  },
  {
    id: 3,
    question: "Have you ever spread a rumor just for fun?",
    options: ["No", "Maybe once", "Yes, it's entertaining"],
    weights: [0, 5, 10]
  },
  {
    id: 4,
    question: "If you found a wallet with cash, what would you do?",
    options: ["Return it all", "Keep cash, return wallet", "Keep everything"],
    weights: [0, 5, 10]
  },
  {
    id: 5,
    question: "Do you think you are superior to most people?",
    options: ["No", "In some ways", "Absolutely"],
    weights: [0, 5, 10]
  },
  {
    id: 6,
    question: "How often do you lie to get what you want?",
    options: ["Rarely", "Occasionally", "Frequently"],
    weights: [0, 5, 10]
  },
  {
    id: 7,
    question: "Do you enjoy drama?",
    options: ["Hate it", "Watch from sidelines", "Create it"],
    weights: [0, 5, 10]
  },
  {
    id: 8,
    question: "Have you ever ghosted someone simply because you got bored?",
    options: ["No", "Once or twice", "Yes, often"],
    weights: [0, 5, 10]
  },
  {
    id: 9,
    question: "Do you apologize when you're wrong?",
    options: ["Always", "Reluctantly", "Never"],
    weights: [0, 5, 10]
  },
  {
    id: 10,
    question: "Do you manipulate people to your advantage?",
    options: ["Never", "Unintentionally", "Yes, it's a skill"],
    weights: [0, 5, 10]
  }
];

const screenWidth = Dimensions.get('window').width;

export const ToxicityTestScreen = () => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleAnswer = (weight: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();

    // Delay state update slightly for animation effect
    setTimeout(() => {
        const newScore = score + weight;
        if (currentIndex < QUESTIONS.length - 1) {
            setScore(newScore);
            setCurrentIndex(currentIndex + 1);
        } else {
            setScore(newScore);
            setShowResult(true);
        }
    }, 200);
  };

  const getToxicityLevel = (finalScore: number) => {
    if (finalScore < 20) return { label: "Pure Soul", color: "#4CAF50" };
    if (finalScore < 50) return { label: "Human, Flawed", color: "#FFC107" };
    if (finalScore < 80) return { label: "Toxic Hazard", color: "#FF5722" };
    return { label: "Radioactive", color: "#D32F2F" };
  };

  const resetTest = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const level = getToxicityLevel(score);
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Toxicity Score</Text>
            <View style={[styles.scoreCircle, { borderColor: level.color }]}>
                <Text style={[styles.scoreText, { color: level.color }]}>{score}%</Text>
            </View>
            <Text style={[styles.levelText, { color: level.color }]}>{level.label}</Text>
            <Text style={styles.resultDescription}>
                {score < 50 ? "You're mostly safe to be around." : "You might want to work on yourself."}
            </Text>
            
            <TouchableOpacity style={styles.retryButton} onPress={resetTest}>
                <Text style={styles.retryText}>Retake Test</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.progressContainer, { top: insets.top + 20 }]}>
        <Text style={styles.progressText}>Question {currentIndex + 1} / {QUESTIONS.length}</Text>
        <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }]} />
        </View>
      </View>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.questionNumber}>Q.0{currentIndex + 1}</Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.optionButton}
                    onPress={() => handleAnswer(currentQuestion.weights[index])}
                >
                    <View style={styles.radioButton}>
                        <View style={styles.radioInner} />
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  progressContainer: {
    position: 'absolute',
    top: 60,
    width: '100%',
  },
  progressText: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: 2,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadiusL,
    padding: SPACING.xl,
    width: '100%',
    minHeight: 400,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  questionNumber: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.m,
    fontFamily: 'monospace',
  },
  questionText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SPACING.xl,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: SPACING.m,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.surfaceHighlight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    marginRight: SPACING.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 0, 
    height: 0,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
  },
  
  // Results
  resultCard: {
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.xl,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  resultDescription: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.text,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.m,
    borderRadius: SIZES.borderRadius,
  },
  retryText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
