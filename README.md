# Lunch Buddy

Order your DFN lunch from BrainX HR using Lunch Buddy.

## Steps

1. **Install dependencies**
   ```
   npm install
   npx playwright install
   ```

2. **Add your settings** to a `.env` file in the project root (see `.env.example`):
   ```
   BRAINX_EMAIL=your.email@example.com
   BRAINX_PASSWORD=your-password
   LOCATION=ICC Techno Hub
   FOOD_TYPE=Chicken
   CHICKEN_FRIENDS=[Name One,Name Two]
   FISH_FRIENDS=[]
   ```

   | Variable | Used by | Notes |
   |---|---|---|
   | `BRAINX_EMAIL`, `BRAINX_PASSWORD` | both | Your BrainX HR login |
   | `LOCATION` | both | Cafe location, defaults to `ICC Techno Hub` |
   | `FOOD_TYPE` | your order | `Chicken`, `Fish` or `Vegetable`, defaults to `Chicken` |
   | `CHICKEN_FRIENDS` | friends' orders | Colleagues who get Chicken, as `[Name One,Name Two]` |
   | `FISH_FRIENDS` | friends' orders | Colleagues who get Fish, same format |

   Friend names must match the BrainX colleague dropdown exactly, e.g. `Achala Fernando`.

3. **Run Lunch Buddy**

   Order for yourself:
   ```
   npx playwright test order-food-for-you
   ```

   Order for friends:
   ```
   npx playwright test order-for-friends
   ```

   `npm test` runs both. Add `--headed` to watch the browser.

4. **What it does**

   *Order food for you* (`order-food-for-you/`)
   - Logs in to BrainX HR
   - Opens **Baker Street** from Useful Links
   - Selects the `LOCATION`
   - Selects the food type from `FOOD_TYPE`
   - Clicks **Submit Order** and takes a screenshot

   *Order food for friends* (`order-for-friends/`)
   - Logs in and opens **Baker Street**
   - For every name in `CHICKEN_FRIENDS`, then `FISH_FRIENDS`:
     selects the `LOCATION`, sets **Order For** to *For a Colleague*, picks the colleague and food type, and clicks **Submit Order**
   - Takes a screenshot at the end
   - Skips itself if both friend lists are empty

   Screenshots are saved in `screenshots/`.

> Remember: the counter closes at 10:30 am. Orders placed for a colleague notify them, and they can't order for themselves afterwards.

## Dietary notice

Lunch Buddy does not support vegetarians in the friends flow. Veges pls go order your grass manually. 🌱
