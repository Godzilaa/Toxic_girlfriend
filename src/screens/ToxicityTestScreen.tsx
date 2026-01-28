import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const QUESTIONS = [
  {
    id: 1,
    question: "Does she get mad when you don't reply instantly?",
    options: ["Never", "Sometimes", "Always creates a fight"],
    weights: [0, 5, 10]
  },
  {
    id: 2,
    question: "Does she go through your phone without asking?",
    options: ["No, she trusts me", "Once or twice", "Regularly checks it"],
    weights: [0, 5, 10]
  },
  {
    id: 3,
    question: "Does she make you feel guilty for seeing your friends?",
    options: ["Encourages me", "Makes sarcastic comments", "Starts a fight"],
    weights: [0, 5, 10]
  },
  {
    id: 4,
    question: "Does she bring up past mistakes in new arguments?",
    options: ["Sticks to the topic", "Sometimes", "Keeps a scorecard"],
    weights: [0, 5, 10]
  },
  {
    id: 5,
    question: "Does she threaten to break up to get her way?",
    options: ["Never", "In heat of moment", "It's her go-to move"],
    weights: [0, 5, 10]
  },
  {
    id: 6,
    question: "Does she apologize when she is wrong?",
    options: ["Yes, sincerely", "Reluctantly", "Never, turns it on me"],
    weights: [0, 5, 10]
  },
  {
    id: 7,
    question: "Does she post passive-aggressive aimed at you?",
    options: ["No", "Subtweets sometimes", "Public shaming"],
    weights: [0, 5, 10]
  },
  {
    id: 8,
    question: "Does she try to control what you wear or eat?",
    options: ["No", "Gives opinions", "Demands changes"],
    weights: [0, 5, 10]
  },
  {
    id: 9,
    question: "Does she get jealous of female coworkers/friends?",
    options: ["Secure", "Ask questions", "Accusatory/Paranoid"],
    weights: [0, 5, 10]
  },
  {
    id: 10,
    question: "Do you feel like you're walking on eggshells?",
    options: ["Relaxed", "Sometimes", "Constantly anxious"],
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
    if (finalScore < 20) return { label: "She's a Keeper", color: "#4CAF50" };
    if (finalScore < 50) return { label: "Typical Human", color: "#FFC107" };
    if (finalScore < 80) return { label: "Walking Red Flag", color: "#FF5722" };
    return { label: "Run For The Hills", color: "#FF0055" };
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
            <Text style={styles.resultTitle}>Gf Toxicity Score</Text>
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
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
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
