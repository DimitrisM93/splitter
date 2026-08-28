/**
 * Calculate net balance and breakdown for couple expenses
 */
export function calculateCoupleSummary(expenses = [], settlements = [], settings) {
  const p1Id = settings.partner1.id;
  const p2Id = settings.partner2.id;

  let partner1Paid = 0;
  let partner2Paid = 0;

  let partner1Share = 0;
  let partner2Share = 0;

  expenses.forEach(exp => {
    const amt = parseFloat(exp.amount) || 0;
    if (exp.paidBy === p1Id) {
      partner1Paid += amt;
    } else if (exp.paidBy === p2Id) {
      partner2Paid += amt;
    }

    // Determine shares based on splitType
    if (exp.splitType === 'equal') {
      partner1Share += amt * 0.5;
      partner2Share += amt * 0.5;
    } else if (exp.splitType === 'income') {
      const ratio1 = (settings.partner1.incomeRatio || 50) / 100;
      const ratio2 = 1 - ratio1;
      partner1Share += amt * ratio1;
      partner2Share += amt * ratio2;
    } else if (exp.splitType === 'p1_full') {
      partner1Share += amt;
    } else if (exp.splitType === 'p2_full') {
      partner2Share += amt;
    } else if (exp.splitType === 'custom') {
      const p1Custom = parseFloat(exp.customP1Share) || 0;
      const p2Custom = parseFloat(exp.customP2Share) || 0;
      partner1Share += p1Custom;
      partner2Share += p2Custom;
    } else {
      partner1Share += amt * 0.5;
      partner2Share += amt * 0.5;
    }
  });

  // Calculate settlement impacts
  let settlementAdjustment = 0; // Positive if P1 paid P2; Negative if P2 paid P1
  settlements.forEach(s => {
    const amt = parseFloat(s.amount) || 0;
    if (s.payerId === p1Id && s.receiverId === p2Id) {
      settlementAdjustment += amt;
    } else if (s.payerId === p2Id && s.receiverId === p1Id) {
      settlementAdjustment -= amt;
    }
  });

  // Net Balance calculation:
  // Net owed to Partner 1 = (P1 Paid - P1 Share) + settlementAdjustment
  // Positive value = Partner 2 owes Partner 1 $X
  // Negative value = Partner 1 owes Partner 2 $Y
  const netP1Balance = (partner1Paid - partner1Share) + settlementAdjustment;

  return {
    totalExpenses: partner1Paid + partner2Paid,
    partner1Paid,
    partner2Paid,
    partner1Share,
    partner2Share,
    netP1Balance, // >0 means P2 owes P1; <0 means P1 owes P2
    settlementAdjustment
  };
}

export function formatCurrency(amount, currency = '$') {
  const abs = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${currency}${abs}`;
}
