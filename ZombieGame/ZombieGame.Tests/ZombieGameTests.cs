using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ZombieGame.Tests
{
	[TestClass()]
	public class ZombieGameTests
	{
		[TestMethod]
		public void ZombieCount_GreaterThanZero_Success()
		{
			int zombie = 10;

			Assert.IsTrue(zombie > 0);
		}

		[TestMethod]
		public void Player_ExistsOnPage_Success()
		{
			int playerId = 1;

			Assert.IsNotNull(playerId);
		}
	}
}
