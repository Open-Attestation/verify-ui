import "testcafe";

fixture("Verify documents").page`http://localhost:3000`;

test("test", async (t) => {
  await t.expect(true).eql(true);
});
