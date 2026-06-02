export class GetYearlyDashboardUsecase {
  execute(userId: string) {
    return { userId, period: 'yearly', generatedAt: new Date() };
  }
}
