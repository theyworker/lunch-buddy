# Lunch Buddy

Order your DFN lunch from BrainX HR using Lunch Buddy.

## Steps

1. **Install dependencies**
   ```
   npm install
   npx playwright install
   ```

2. **Add your BrainX credentials** to a `.env` file in the project root:
   ```
   BRAINX_EMAIL=your.email@example.com
   BRAINX_PASSWORD=your-password
   FOOD_TYPE=Chicken
   ```
   `FOOD_TYPE` must be `Chicken`, `Fish` or `Vegetable` (defaults to `Chicken`).

3. **Run Lunch Buddy**
   ```
   npm test
   ```

4. **What it does**
   - Logs in to BrainX HR
   - Opens **Baker Street** from Useful Links
   - Selects the location **ICC Techno Hub**
   - Selects the food type from `FOOD_TYPE`
   - Places your order

## Coming soon

- Add for friends / team
