Rotten Tomatoes
                       vs
          IMDB Movie Ratings








                                           IAT-814
                                






                                  Mrinal Gosain
                            Manju Malateshappa








Table of Contents:
Overview:
Useful links:
Introduction:
Datasets:
Target Audience:
Problem/Domain Questions:
Data:
Visualization design:
Color coding:
Charts:
Chart 1 - Release year versus Ratings:
Screenshot of chart:
The key observations:
Interactivity:
Chart 2 - Genre versus Ratings:
Screenshot of chart:
Key findings:
Interactivity:
Chart 3 - Motion Pictures Rating(MPAA) versus ratings:
Screenshot of chart:
Interactivity:
Chart 4 - Run time versus rating:
Screenshot of chart:
key observation:
Interactivity:
Chart 5 - Budget and Gross Earning versus rating:
Screenshot of chart:
Other considerations:
Interactivity:
Movie details table:
Screenshot of the movies table:
Interactivity:
Future Work:
Conclusions:
References and appendices:


Overview:
With a growing number of movie rating platforms it becomes difficult for an individual to rely on a single source of truth.
Thus, understanding the rating across different platforms for several factors in conjunction will help in unveiling some hidden insights of the movie industry.
We present an interactive dashboard which helps the end user to find the various insights of the film industry which depends on ratings.
The interactive dashboards are created in order to aid a comparison between the ratings of IMDB and the Rotten tomatoes on 5 factors namely, Release year, Genre, Motion Picture Rating, Runitime, Budget & Gross Earning.
Useful links:
Video: https://youtu.be/SdKLSgdzCaQ


Demo:  https://iat814-team6-dashboard.herokuapp.com/


Code: https://github.com/THEMrinaal/IAT814
Introduction:
The main goal of the project is to help the audience to get a single stop-shop for viewing and analyzing the movie rating across two different platforms namely IMDB and rotten tomatoes.


Datasets:
1. IMDB dataset
2. Rotten Tomatoes


Target Audience:
* Movie Fanatics
* Movie Critics
* Market research analyst


Problem/Domain Questions:
1. How do ratings differ on IMDB and Rotten tomatoes platforms?
2. How are the movie ratings varies with time?
3. Does the movie rating depend on Motion Picture Association of America (MPAA) ratings?
4. Does movie length affect ratings of the movies on IMDB and RT differently?
5.  Is there a significant difference in rating given across both platforms for low budget movies vs high budget movies?
6. How does average ratings vary with different genres for IMDB and rotten tomatoes?
7. How are ratings affected due to different features taken in conjunction?
Data:
We have used the IMDB data set and Rotten tomatoes dataset from Kaggle.The data sets had a lot of mismatch and missing information. We cleaned the data and combined both the datasets based on the movie names.
We performed feature engineering and created two new columns - IMDB rating and Rotten Tomatoes ratings respectively. These two columns come from two different datasets which were joined on the basis of movie names.
We removed some of the columns which were not relevant for our project scope. We considered the movies from 1980  to 2020. In total, we had 3740 movies after merging both the data sets.
Also, after feature engineering, we came up with 23 columns which were really important to create the data visualizations covering the scope of our project.
Visualization design:
The dashboard consists of 5 plots which have two way data flow. The charts are interconnected to each other and changing one particular parameter in a chart would reflect in all the connected charts. 
We have used techniques like Brushing in one of the charts where you can brush over the time horizon in order to get insights based on the time window. Then, we have used cross filters to filter data based on different charts. 
We have used a highlighting feature to showcase the hover effect if the user points the mouse over a particular chart. For charts which use lines, it will showcase the tooltip whereas for charts which use the area it fills the area with that color with lesser hue. Then, selecting a particular feature keeps that in the chart whereas for the non-selected components, color is turned off. 
Lastly, We have tried to keep colors consistent throughout the dashboard which increases the expressiveness of the dashboard. For example, we didn’t need to specify the color encoding for IMDB(yellow) and Rotten tomatoes (red) explicitly anywhere in the dashboard but we have ensured that it is intuitive and reaches the audience as  what we had planned. 
We also listed down all the movies with all the relevant details like movie title, movie info, directors, authors, actors, production company etc. The user of our dashboard can select the number of data items to be viewed using a drop-down filter option. 
Screenshot of dashboard:
  

Color coding:
We used red and yellow colors to indicate the categorical data labels  Rotten tomatoes and IMDB respectively. We made sure to have the consistency of these two colors in all the charts.
Charts:
Chart 1 - Release year versus Ratings:
We used a multi line chart to show the distribution of movie ratings over the years. The x-axis indicates the years (1980-2020) and the y-axis indicates the rating. The user of our dashboard can observe how the movie ratings are varied across different years.
Screenshot of chart:
  

The key observations:
1. The Rotten tomatoes ratings were almost higher. One reason could be because the Rotten tomatoes ratings are given by movie critics (professionals) and users. Imdb ratings are given by just the users.
2. The rotten tomatoes ratings are always higher compared to IMDB ratings until 1999. Since the people who watched the old movies never had a chance to rate these movies due to limitation of technology and also on rotten tomatoes, the ratings are given by professionals. 
Interactivity:
* Brushing: TBrush the chart along the x direction to filter year..
* Hover: The details of the data points can be seen on hovering the data points.
* Reset Option: The reset button will be shown once users have selected a range of years through brushing in the data. This option can be used to reset all the user actions in the chart. 
Chart 2 - Genre versus Ratings:
We have used a radar chart which showcases the median ratings for IMDB and Rotten tomatoes across five different genres. We came up with this chart as this chart captures the elegance of magnitude of median rating as well as at the same time it also helps compactly capture the difference in median ratings across different genres easily. Other considerations included bar charts where for each genre we would have two bar charts representing the median ratings for IMDb and Rotten tomatoes. However, due to small differences in the values of ratings it would have been difficult for the end user to capture the essence of the comparison. Thus, we dropped the later idea.
Screenshot of chart:
  

Key findings:
1. When the whole timeline is considered, it seems like thriller movies are well received by the audience as the median rating is higher for both the IMDb and rotten tomatoes as compared to other genres.  On the other hand the median rating is less for horror movies when compared relativistically with other genres.
2. One more interesting insight we observed is that for the time period 1980-2000, median rating of movies with Thriller genre is higher than all the other genres whereas if take time window of 2000-2020 then median rating for Drama is higher than all. Perhaps, it reflects the shift in the taste of the audience and people tend to like drama movies more.
Interactivity:
* Click: Click the genre name surrounding the edge of the chart to filter
* Hover: The details of the data points can be seen on hovering the data points.
* Reset Option: The reset button will be shown in the chart immediately once the user performs some action on the chart. . The reset button can be used to reset all the user actions in the chart. 


Chart 3 - Motion Pictures Rating(MPAA) versus ratings:
In this chart, we have used a pyramidal chart which consists of bar charts for rotten tomatoes and IMDb. And the MPAA legends used are in increasing order of restrictions if you observe the y-axis and on the x-axis, we have the ratings. 
Other considerations included a sunburst chart which could have hierarchy, on the top level it could have all the MPAA ratings and then on clicking any of the petals of the sunburst chart it will show the rotten tomato and IMDb ratings respectively. 
The reason we dropped that idea is because the  high level petals of the sunburst will be equal as these are categorical features and then after clicking on that it would have shown the stats. But, we wanted to be more expressive so that one could get insights with the first look itself instead of trading it off with a chart which looks complex but doesn’t reflect the trends  intuitively in a lucid way.
Screenshot of chart:
  



Interactivity:
* Click: Click the motion picture rating along the y axis to filter
* Hover: The details of the data points can be seen on hovering the data points. Also the bars will be filled with corresponding (red/yellow) colors indicating the selection.
* Reset Option: The reset button will be shown in the chart immediately once the user performs some action on the chart. . The reset button can be used to reset all the user actions in the chart. 


Chart 4 - Run time versus rating:
For Runtime versus rating, We have chosen the box plot to represent the ratings (y-axis) and the binned runtime on x-axis. This has been done to compare and understand the impact of runtime on ratings. Box plot is chosen because it gives more information about the spread of rating as one can not only see the median but also the 25th percentile, 75th percentile as well as the highest and the lowest value in a particular bin which will help to compare the spread of ratings if one has to compare different runtime bins.
Screenshot of chart:
  

Another consideration we had was the grouped violin chart but that wouldn’t have expressed the minute details which box plot can tell about the distribution. 
Violin plot looks like this: ( It’s just an example to showcase a violin plot for clarity)
  

key observation:
1. The spread of ratings of movies with runtime> 150 min is less than the movies with runtime <= 90 min also the spread of the rating in movies with runtime >150 min is higher than the spread of movies with runtime <= 90 min which means if one picks movies which has runtime of more than 150 min. Then, the on an average the rating will be higher than for a movie picked which has runtime <=90min
Interactivity:
* Click: Click the runtime along the x axis to filter
* Hover: The details of the data points can be seen on hovering the data points. Also the bars will be filled with corresponding (red/yellow) colors indicating the selection.
* Reset Option: The reset button will be shown in the chart immediately once the user performs some action on the chart. . The reset button can be used to reset all the user actions in the chart. 




Chart 5 - Budget and Gross Earning versus rating:
This is a matrix chart where we have Budget on the x-axis and gross earnings on y-axis. And, within each grid we have  a bar chart which is used to compare the median rating.
The reason we have chosen a matrix chart is because it can showcase various scenarios for example if a user wants to compare high budget movies and low budget movies with gross earnings they made for a particular bucket they can do so.
Screenshot of chart:
  

Other considerations: 
We had a lollipop chart instead of a bar chart before but after consultation with the professor and TA. We found that the knobs of the lollipop could be hard to interpret especially when the difference  in the median rating is very less. So, We accepted the suggestions and incorporated the changes as suggested.
Screenshot of chart:
  

Interactivity:
* Click: Click the budget and the gross earning quartiles to filter
* Hover: The details of the data points can be seen on hovering the data points. Also the bars will be filled with corresponding (red/yellow) colors indicating the selection.
* Reset Option: The reset button will be shown in the chart immediately once the user performs some action on the chart. . The reset button can be used to reset all the user actions in the chart. 
Movie details table:
We also included a movie details table to showcase the result set which one could see without filtering and after filtering multiple things in the dashboard. This has been done to ensure that the end user can get more information if one wishes to look at the dataset. 
Screenshot of the movies table:
  

Interactivity:
* Show filter: The number of records to be shown can be filtered using this option. This UI element provides a drop down list with 4 options (10,25,50 and 100 ) and the user can select one.The default value is 10.
* Search Option: The user can search the data points using keywords.
* Selection of page numbers: The user can click on page numbers to see more data points.
Future Work:


We had a broad scope in this project during the initial proposal. The discussions during the design phase helped us to narrow down our project scope and also helped us to develop a  demo-able dashboard covering the objectives of our project within the limited time.
We plan to address the following analytical questions in the next iterations:
* How movie ratings differ based on gender and demographics?
* Does any special events in a particular time frame have an effect on the ratings?
* Does the ratings of the movies depend on the actor's country of origin?
* Does a particular combination of actor, director and producer always end up with the profit?


Conclusions:
Though we have narrowed down the project scope to compare the ratings of IMDB and the Rotten tomatoes, The final dashboard addressed the main objective of our project and also helped us find the answers for most of the analytics questions. 
We have selected colors wisely (red and yellow) to color code the categorical data(Rotten Tomatoes and IMDB). We maintained the color consistency across the dashboard. The interactivity in the dashboard is supported through brushing(selecting the year range), filters, hover, click. The user can find all the relevant information about the movies in the “Movie” table. Also one can download the raw data using  the “download raw data” option.
 The user friendly dashboard would help to unveil the trends in the data and addresses the main analytical questions which are part of project scope.
References and appendices:


1. Jay Ng, 2015, IMDb Data Visualization. https://ngchwanlii.github.io/datavis/imdb-intro.html
2. Xinghui Song, Analyzing Movie Scores on IMDb and Rotten Tomatoes. http://rstudio-pubs-static.s3.amazonaws.com/336722_2193716117584b63a2a6ebb837217d85.html 
3. Scott Berinato, June 2016, Visualizations That Really Work. https://hbr.org/2016/06/visualizations-that-really-work