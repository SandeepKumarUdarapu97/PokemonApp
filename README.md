# PokemonApp
https://drive.google.com/file/d/16GL6CUos5YSgSDIo4DQx43puuSpckYe6/view?usp=drivesdk ---video

npm i --legacy-peer-deps(some of the libraries have discripance at react version that's the reason for --legacy-peer-deps)
npx react-native run-android (IOS wont' work becuase for the notifications we need developer account for APN certificates etc..)

googleSign (you can check)
datafetching
dynamic data fetching with proper loaders
notifications at (terminate,background and foreground)
three buttons the state is stored in async storage with redux toolkit

# Approach
created three screens(Login,Home and Details)
one Root navigator file(AppNavigator)

In redux folder we have store.ts which is used to configure the three slices i have created(Auth,pokemon and buttons). Here the Auth and Buttons slices and persisted using AsyncStore.
AuthSlice:- login, logout and notificationData, login stores user data, logout clears user Data, notificationData to store the remote data we got from notification.
buttonsSlice:- to store 3 buttons states individually
pokemonSlice:- Api call to fetch data and store it in redux using createAsyncThunk

In Services we have two services
 AuthService:- sign and signout at googleSign level
 notificationService:- required permissions for notifications, Cofiguring Push notifications and a method for local notification

In utils we have some common methods for dynamic sizing like getWidth and getHeight with Dimensions and for the fontsize some method

DYNAMIC DATA FETCHING
by using useInfiniteQuery i made dynamix data fetching.

NOTIFICATIONS

Notifications are some tricky part in this project
By following document i have intigrated the push notifications after that at BACKGROUND and TERMINATE state the notifications are coming when i sent notifications with the help of FCM token, But in foreground it won't show notification by using REACT-NATIVE-PUSH-NOTIFICATIONS i have triggered local notification to show.

when ever the the user click on the notification i store the data coming from notification in authSlice(Redux),
i have created a useEffect with redux notificationData dependency in Home screend. Whenever we have the data it will navigate to details screen with url and we will clear the data in redux
