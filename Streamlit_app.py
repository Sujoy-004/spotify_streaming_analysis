import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from wordcloud import WordCloud
import json

# Configure page
st.set_page_config(
    page_title="Spotify Streaming Analysis Dashboard",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1DB954;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: bold;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #1DB954, #1ed760);
        padding: 1.5rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .stSelectbox > div > div {
        background-color: #f8f9fa;
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(180deg, #1DB954, #1ed760);
    }
    
    .insight-box {
        background-color: #f0f8f0;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #1DB954;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def load_sample_data():
    """Generate sample Spotify streaming data for demonstration"""
    np.random.seed(42)
    
    artists = ['Taylor Swift', 'Drake', 'Bad Bunny', 'The Weeknd', 'Ariana Grande', 
               'Ed Sheeran', 'Billie Eilish', 'Post Malone', 'Dua Lipa', 'Harry Styles']
    
    tracks = ['Song A', 'Song B', 'Song C', 'Song D', 'Song E', 'Song F', 'Song G', 'Song H']
    
    data = []
    start_date = datetime.now() - timedelta(days=365)
    
    for i in range(5000):
        date = start_date + timedelta(
            days=np.random.randint(0, 365),
            hours=np.random.randint(0, 24),
            minutes=np.random.randint(0, 60)
        )
        
        artist = np.random.choice(artists, p=[0.15, 0.12, 0.10, 0.10, 0.10, 0.10, 0.08, 0.08, 0.08, 0.09])
        track = f"{np.random.choice(tracks)} - {artist}"
        ms_played = np.random.randint(30000, 250000)  # 30 seconds to ~4 minutes
        
        data.append({
            'endTime': date.strftime('%Y-%m-%d %H:%M:%S'),
            'artistName': artist,
            'trackName': track,
            'msPlayed': ms_played,
            'reason_start': np.random.choice(['trackdone', 'fwdbtn', 'playbtn']),
            'reason_end': np.random.choice(['trackdone', 'logout', 'endplay'])
        })
    
    return pd.DataFrame(data)

@st.cache_data
def process_data(data):
    """Process the Spotify streaming data"""
    # Convert datetime
    data['endTime'] = pd.to_datetime(data['endTime'])
    data['date'] = data['endTime'].dt.date
    data['hour'] = data['endTime'].dt.hour
    data['day_of_week'] = data['endTime'].dt.day_name()
    data['month'] = data['endTime'].dt.month_name()
    data['year'] = data['endTime'].dt.year
    
    # Convert milliseconds to minutes
    data['minutes_played'] = data['msPlayed'] / 1000 / 60
    
    # Filter out very short plays (less than 30 seconds)
    data = data[data['msPlayed'] >= 30000]
    
    return data

def load_user_data():
    """Allow users to upload their own Spotify data"""
    uploaded_file = st.file_uploader(
        "Upload your Spotify Extended Streaming History JSON file",
        type=['json'],
        help="You can request this data from Spotify's Privacy Settings"
    )
    
    if uploaded_file is not None:
        try:
            data = pd.read_json(uploaded_file)
            if 'endTime' in data.columns and 'artistName' in data.columns:
                st.success("✅ Data loaded successfully!")
                return process_data(data)
            else:
                st.error("❌ Invalid file format. Please upload Spotify streaming history JSON.")
                return None
        except Exception as e:
            st.error(f"❌ Error loading file: {str(e)}")
            return None
    
    return None

def show_overview(data):
    """Display overview statistics"""
    st.markdown('<h1 class="main-header">📊 Streaming Overview</h1>', unsafe_allow_html=True)
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    total_streams = len(data)
    unique_tracks = data['trackName'].nunique()
    unique_artists = data['artistName'].nunique()
    total_hours = data['minutes_played'].sum() / 60
    
    with col1:
        st.markdown(
            f"""<div class="metric-card">
                <h3>{total_streams:,}</h3>
                <p>Total Streams</p>
            </div>""", unsafe_allow_html=True
        )
    
    with col2:
        st.markdown(
            f"""<div class="metric-card">
                <h3>{unique_tracks:,}</h3>
                <p>Unique Tracks</p>
            </div>""", unsafe_allow_html=True
        )
    
    with col3:
        st.markdown(
            f"""<div class="metric-card">
                <h3>{unique_artists:,}</h3>
                <p>Unique Artists</p>
            </div>""", unsafe_allow_html=True
        )
    
    with col4:
        st.markdown(
            f"""<div class="metric-card">
                <h3>{total_hours:.0f}h</h3>
                <p>Total Listening</p>
            </div>""", unsafe_allow_html=True
        )
    
    st.markdown("---")
    
    # Insights
    st.subheader("🧠 Key Insights")
    
    avg_daily_streams = total_streams / data['date'].nunique()
    top_artist = data['artistName'].value_counts().index[0]
    top_artist_count = data['artistName'].value_counts().iloc[0]
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(
            f"""<div class="insight-box">
                <strong>Daily Average:</strong> You listen to ~{avg_daily_streams:.0f} songs per day
            </div>""", unsafe_allow_html=True
        )
        
        st.markdown(
            f"""<div class="insight-box">
                <strong>Top Artist:</strong> {top_artist} with {top_artist_count} streams
            </div>""", unsafe_allow_html=True
        )
    
    with col2:
        avg_song_length = data['minutes_played'].mean()
        st.markdown(
            f"""<div class="insight-box">
                <strong>Average Song Length:</strong> {avg_song_length:.1f} minutes
            </div>""", unsafe_allow_html=True
        )
        
        most_active_hour = data['hour'].value_counts().index[0]
        st.markdown(
            f"""<div class="insight-box">
                <strong>Most Active Hour:</strong> {most_active_hour}:00
            </div>""", unsafe_allow_html=True
        )

def show_listening_patterns(data):
    """Display listening patterns and habits"""
    st.header("🎧 Listening Patterns")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Hourly listening pattern
        hourly_streams = data.groupby('hour').size()
        fig = px.bar(
            x=hourly_streams.index, 
            y=hourly_streams.values,
            title="🕐 Listening Activity by Hour",
            color=hourly_streams.values,
            color_continuous_scale="Viridis"
        )
        fig.update_layout(
            xaxis_title="Hour of Day",
            yaxis_title="Number of Streams",
            showlegend=False,
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Day of week pattern
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        daily_streams = data.groupby('day_of_week').size().reindex(day_order)
        
        fig = px.bar(
            x=daily_streams.index, 
            y=daily_streams.values,
            title="📅 Listening Activity by Day",
            color=daily_streams.values,
            color_continuous_scale="Plasma"
        )
        fig.update_layout(
            xaxis_title="Day of Week",
            yaxis_title="Number of Streams",
            showlegend=False,
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Monthly trend
    st.subheader("📈 Monthly Listening Trends")
    monthly_data = data.groupby(data['endTime'].dt.to_period('M')).agg({
        'trackName': 'count',
        'minutes_played': 'sum'
    }).rename(columns={'trackName': 'streams'})
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=monthly_data.index.astype(str),
        y=monthly_data['streams'],
        mode='lines+markers',
        name='Streams',
        line=dict(color='#1DB954', width=3)
    ))
    
    fig.update_layout(
        title="Monthly Streaming Activity",
        xaxis_title="Month",
        yaxis_title="Number of Streams",
        height=400
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_top_content(data):
    """Display top artists and tracks"""
    st.header("🏆 Top Artists & Tracks")
    
    # Filters
    col1, col2 = st.columns(2)
    with col1:
        top_n = st.slider("Number of items to show", 5, 20, 10)
    with col2:
        metric = st.selectbox("Rank by:", ["Stream Count", "Total Time"])
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🎤 Top Artists")
        if metric == "Stream Count":
            top_artists = data['artistName'].value_counts().head(top_n)
            y_label = "Number of Streams"
        else:
            top_artists = data.groupby('artistName')['minutes_played'].sum().sort_values(ascending=False).head(top_n)
            y_label = "Total Minutes"
        
        fig = px.bar(
            y=top_artists.index[::-1],
            x=top_artists.values[::-1],
            orientation='h',
            title=f"Top {top_n} Artists by {metric}",
            color=top_artists.values[::-1],
            color_continuous_scale="Viridis"
        )
        fig.update_layout(
            xaxis_title=y_label,
            yaxis_title="Artist",
            showlegend=False,
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("🎵 Top Tracks")
        if metric == "Stream Count":
            top_tracks = data['trackName'].value_counts().head(top_n)
            y_label = "Number of Streams"
        else:
            top_tracks = data.groupby('trackName')['minutes_played'].sum().sort_values(ascending=False).head(top_n)
            y_label = "Total Minutes"
        
        # Truncate long track names
        track_names = [name[:30] + "..." if len(name) > 30 else name for name in top_tracks.index]
        
        fig = px.bar(
            y=track_names[::-1],
            x=top_tracks.values[::-1],
            orientation='h',
            title=f"Top {top_n} Tracks by {metric}",
            color=top_tracks.values[::-1],
            color_continuous_scale="Plasma"
        )
        fig.update_layout(
            xaxis_title=y_label,
            yaxis_title="Track",
            showlegend=False,
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)

def show_music_discovery(data):
    """Show music discovery insights"""
    st.header("🔍 Music Discovery & Diversity")
    
    # Artist diversity over time
    monthly_artists = data.groupby(data['endTime'].dt.to_period('M'))['artistName'].nunique()
    
    fig = px.line(
        x=monthly_artists.index.astype(str),
        y=monthly_artists.values,
        title="Artist Diversity Over Time",
        markers=True
    )
    fig.update_layout(
        xaxis_title="Month",
        yaxis_title="Unique Artists",
        height=400
    )
    st.plotly_chart(fig, use_container_width=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Skip rate analysis
        st.subheader("⏭️ Skip Rate Analysis")
        skip_data = data[data['reason_end'].notna()]
        skip_counts = skip_data['reason_end'].value_counts()
        
        fig = px.pie(
            values=skip_counts.values,
            names=skip_counts.index,
            title="How Songs End"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        # Listening completion rate
        st.subheader("📊 Listening Completion")
        # Assuming songs longer than 3 minutes are fully played
        data['completion_rate'] = np.where(data['minutes_played'] >= 3, 'Completed', 'Skipped')
        completion_counts = data['completion_rate'].value_counts()
        
        fig = px.pie(
            values=completion_counts.values,
            names=completion_counts.index,
            title="Song Completion Rate",
            color_discrete_map={'Completed': '#1DB954', 'Skipped': '#ff6b6b'}
        )
        st.plotly_chart(fig, use_container_width=True)

def main():
    """Main application function"""
    st.sidebar.title("🎵 Spotify Analytics")
    st.sidebar.markdown("---")
    
    # Data source selection
    data_source = st.sidebar.radio(
        "Choose data source:",
        ["Use Sample Data", "Upload My Data"]
    )
    
    if data_source == "Upload My Data":
        data = load_user_data()
        if data is None:
            st.info("👆 Please upload your Spotify data file to get started!")
            st.markdown("""
            ### How to get your Spotify data:
            1. Go to [Spotify Privacy Settings](https://www.spotify.com/us/account/privacy/)
            2. Scroll down to "Download your data"
            3. Request "Extended Streaming History"
            4. Wait for email (can take up to 30 days)
            5. Download and upload the JSON file here
            """)
            return
    else:
        with st.spinner("Loading sample data..."):
            data = load_sample_data()
            data = process_data(data)
        
        st.sidebar.info("🎯 Using sample data for demonstration")
    
    # Navigation
    st.sidebar.markdown("---")
    page = st.sidebar.selectbox(
        "Navigate to:",
        ["📊 Overview", "🎧 Listening Patterns", "🏆 Top Content", "🔍 Music Discovery"]
    )
    
    # Display selected page
    if page == "📊 Overview":
        show_overview(data)
    elif page == "🎧 Listening Patterns":
        show_listening_patterns(data)
    elif page == "🏆 Top Content":
        show_top_content(data)
    elif page == "🔍 Music Discovery":
        show_music_discovery(data)
    
    # Footer
    st.sidebar.markdown("---")
    st.sidebar.markdown("""
    **Made with ❤️ using Streamlit**
    
    Connect with your music data and discover your listening habits!
    """)

if __name__ == "__main__":
    main()
