'use client';

import { useState, useEffect } from 'react';
import { useGoalStore } from '@/stores/goalStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { Goal } from '@/types';

export default function GoalsPage() {
    const {
        goals,
        isLoading,
        error,
        fetchGoals,
        createGoal,
        updateGoalAPI,
        deleteGoalAPI,
        setError
    } = useGoalStore();
}