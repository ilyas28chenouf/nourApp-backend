export class GetMonthlyDashboardUsecase {
  execute(userId: string) {
    return { userId, period: 'monthly', generatedAt: new Date() };
  }
}
