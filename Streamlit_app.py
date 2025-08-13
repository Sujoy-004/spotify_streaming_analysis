import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime
import warnings
import io
warnings.filterwarnings('ignore')

# Set page configuration
st.set_page_config(
    page_title="Spotify 2024 Analysis Dashboard",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3.5rem;
        background: linear-gradient(90deg, #1DB954, #1ed760);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        font-weight: bold;
        margin-bottom: 2rem;
    }
    .metric-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    .sidebar .sidebar-content {
        background-color: #f0f2f6;
    }
    .stSelectbox > div > div > select {
        background-color: #f0f2f6;
    }
    .error-box {
        background-color: #ff4b4b;
        padding: 1rem;
        border-radius: 5px;
        color: white;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

def create_sample_data():
    """Create sample data for demonstration"""
    np.random.seed(42)
    
    # Sample artists and songs
    artists = ['Taylor Swift', 'Bad Bunny', 'The Weeknd', 'SZA', 'Harry Styles', 
              'Dua Lipa', 'Ed Sheeran', 'Ariana Grande', 'Drake', 'Billie Eilish',
              'Post Malone', 'Olivia Rodrigo', 'Doja Cat', 'Justin Bieber', 'BTS']
    
    songs = ['Anti-Hero', 'Flowers', 'Unholy', 'As It Was', 'Heat Waves', 
            'Stay', 'Industry Baby', 'Good 4 U', 'Levitating', 'Blinding Lights',
            'Watermelon Sugar', 'drivers license', 'Peaches', 'Dynamite', 'Shivers']
    
    n_songs = 1000
    df = pd.DataFrame({
        'Track': np.random.choice(songs, n_songs),
        'Artist(s)': np.random.choice(artists, n_songs),
        'Released Year': np.random.choice(range(2020, 2025), n_songs),
        'Released Month': np.random.choice(range(1, 13), n_songs),
        'Released Day': np.random.choice(range(1, 29), n_songs),
        'ISRC': ['US' + str(np.random.randint(10000000, 99999999)) for _ in range(n_songs)],
        'All Time Rank': range(1, n_songs + 1),
        'Track Score': np.random.uniform(50, 100, n_songs).round(1),
        'Spotify Streams': np.random.randint(1000000, 2000000000, n_songs),
        'Spotify Playlist Count': np.random.randint(1000, 50000, n_songs),
        'Spotify Playlist Reach': np.random.randint(100000, 10000000, n_songs),
        'Spotify Popularity': np.random.randint(30, 100, n_songs),
        'YouTube Views': np.random.randint(1000000, 1000000000, n_songs),
        'YouTube Likes': np.random.randint(10000, 10000000, n_songs),
        'TikTok Posts': np.random.randint(1000, 500000, n_songs),
        'TikTok Likes': np.random.randint(100000, 50000000, n_songs),
        'TikTok Views': np.random.randint(1000000, 500000000, n_songs),
        'YouTube Playlist Reach': np.random.randint(100000, 5000000, n_songs),
        'Apple Music Playlist Count': np.random.randint(100, 5000, n_songs),
        'AirPlay Spins': np.random.randint(100, 10000, n_songs),
        'SiriusXM Spins': np.random.randint(10, 1000, n_songs),
        'Deezer Playlist Count': np.random.randint(50, 2000, n_songs),
        'Deezer Playlist Reach': np.random.randint(10000, 1000000, n_songs),
        'Amazon Playlist Count': np.random.randint(20, 1000, n_songs),
        'Pandora Streams': np.random.randint(100000, 50000000, n_songs),
        'Pandora Track Stations': np.random.randint(10, 5000, n_songs),
        'Soundcloud Streams': np.random.randint(10000, 10000000, n_songs),
        'Shazam Counts': np.random.randint(1000, 5000000, n_songs),
        'Explicit Track': np.random.choice([0, 1], n_songs, p=[0.7, 0.3])
    })
    
    return df

def process_dataframe(df):
    """Process and clean the dataframe"""
    # Clean column names
    df.columns = df.columns.str.strip()
    
    # Add derived columns if possible
    if 'Released Year' in df.columns and 'Released Month' in df.columns:
        try:
            df['Release_Date'] = pd.to_datetime(df[['Released Year', 'Released Month']].assign(day=1))
        except:
            pass
    
    return df

def create_top_charts(df, metric_col, title, n=10):
    """Create top charts for any metric"""
    if metric_col in df.columns:
        try:
            top_data = df.nlargest(n, metric_col)
            fig = px.bar(
                top_data, 
                x=metric_col, 
                y='Track' if 'Track' in df.columns else top_data.index,
                color=metric_col,
                orientation='h',
                title=f"Top {n} {title}",
                color_continuous_scale='viridis',
                text=metric_col
            )
            fig.update_layout(height=400, yaxis={'categoryorder':'total ascending'})
            fig.update_traces(texttemplate='%{text:.2s}', textposition='outside')
            return fig
        except Exception as e:
            st.error(f"Error creating chart: {str(e)}")
    return None

def create_artist_analysis(df):
    """Create artist-based analysis"""
    if 'Artist(s)' in df.columns and 'Spotify Streams' in df.columns:
        try:
            # Top artists by streams
            artist_streams = df.groupby('Artist(s)')['Spotify Streams'].sum().sort_values(ascending=False).head(15)
            
            fig = px.bar(
                x=artist_streams.values,
                y=artist_streams.index,
                orientation='h',
                title='Top 15 Artists by Total Streams',
                color=artist_streams.values,
                color_continuous_scale='plasma'
            )
            fig.update_layout(height=500, yaxis={'categoryorder':'total ascending'})
            return fig
        except Exception as e:
            st.error(f"Error creating artist analysis: {str(e)}")
    return None

def create_correlation_heatmap(df):
    """Create correlation heatmap"""
    try:
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) > 1:
            # Remove rank columns for correlation (inverse relationship)
            corr_cols = [col for col in numeric_cols if 'Rank' not in col and 'rank' not in col]
            
            if len(corr_cols) > 1:
                correlation_matrix = df[corr_cols].corr()
                
                fig = px.imshow(
                    correlation_matrix,
                    title="Correlation Matrix of Streaming Metrics",
                    color_continuous_scale='RdBu',
                    aspect='auto'
                )
                fig.update_layout(height=600)
                return fig
    except Exception as e:
        st.error(f"Error creating correlation matrix: {str(e)}")
    return None

def main():
    st.markdown('<h1 class="main-header">🎵 Spotify 2024 Streaming Analysis</h1>', unsafe_allow_html=True)
    
    # Initialize session state
    if 'df' not in st.session_state:
        st.session_state.df = None
    
    # File uploader
    uploaded_file = st.file_uploader(
        "Upload your Spotify dataset (CSV)", 
        type=['csv'],
        help="Upload the Most_Streamed_Spotify_Songs_2024.csv file"
    )
    
    # Load data
    if uploaded_file is not None:
        try:
            # Read uploaded file
            df = pd.read_csv(uploaded_file)
            df = process_dataframe(df)
            st.session_state.df = df
            st.success("✅ Data loaded successfully from uploaded file!")
        except Exception as e:
            st.error(f"❌ Error loading uploaded file: {str(e)}")
            st.info("Using sample data instead...")
            df = create_sample_data()
            df = process_dataframe(df)
            st.session_state.df = df
    elif st.session_state.df is None:
        try:
            # Try to load default file
            df = pd.read_csv('Most_Streamed_Spotify_Songs_2024.csv')
            df = process_dataframe(df)
            st.session_state.df = df
            st.success("✅ Data loaded from default file!")
        except:
            # Use sample data
            st.warning("⚠️ Default dataset not found. Using sample data for demonstration.")
            df = create_sample_data()
            df = process_dataframe(df)
            st.session_state.df = df
    else:
        df = st.session_state.df
    
    # Display basic info about the dataset
    st.info(f"📊 Dataset contains {len(df)} tracks with {len(df.columns)} features")
    
    # Sidebar filters
    st.sidebar.header("🎛️ Filters & Settings")
    
    # Year filter
    if 'Released Year' in df.columns:
        years = sorted(df['Released Year'].unique())
        selected_years = st.sidebar.multiselect(
            "Select Years", 
            options=years, 
            default=years[-3:] if len(years) > 3 else years  # Default to last 3 years
        )
        df_filtered = df[df['Released Year'].isin(selected_years)] if selected_years else df
    else:
        df_filtered = df
    
    # Artist filter
    if 'Artist(s)' in df.columns:
        artists = sorted(df_filtered['Artist(s)'].unique())[:50]  # Limit to first 50 for performance
        selected_artists = st.sidebar.multiselect(
            "Select Artists (optional)", 
            options=artists,
            help="Leave empty to show all artists"
        )
        if selected_artists:
            df_filtered = df_filtered[df_filtered['Artist(s)'].isin(selected_artists)]
    
    # Main dashboard
    st.header("📊 Dashboard Overview")
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        total_tracks = len(df_filtered)
        st.metric("Total Tracks", f"{total_tracks:,}")
    
    with col2:
        if 'Artist(s)' in df_filtered.columns:
            unique_artists = df_filtered['Artist(s)'].nunique()
            st.metric("Unique Artists", f"{unique_artists:,}")
    
    with col3:
        if 'Spotify Streams' in df_filtered.columns:
            total_streams = df_filtered['Spotify Streams'].sum()
            st.metric("Total Streams", f"{total_streams/1e9:.1f}B")
    
    with col4:
        if 'Released Year' in df_filtered.columns:
            year_range = f"{df_filtered['Released Year'].min()}-{df_filtered['Released Year'].max()}"
            st.metric("Year Range", year_range)
    
    # Main visualizations
    st.header("📈 Analytics")
    
    # Top tracks section
    col1, col2 = st.columns(2)
    
    with col1:
        if 'Spotify Streams' in df_filtered.columns:
            fig = create_top_charts(df_filtered, 'Spotify Streams', 'Tracks by Spotify Streams')
            if fig:
                st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        if 'YouTube Views' in df_filtered.columns:
            fig = create_top_charts(df_filtered, 'YouTube Views', 'Tracks by YouTube Views')
            if fig:
                st.plotly_chart(fig, use_container_width=True)
        elif 'Spotify Popularity' in df_filtered.columns:
            fig = create_top_charts(df_filtered, 'Spotify Popularity', 'Tracks by Popularity')
            if fig:
                st.plotly_chart(fig, use_container_width=True)
    
    # Artist analysis
    st.subheader("🎤 Artist Analysis")
    artist_fig = create_artist_analysis(df_filtered)
    if artist_fig:
        st.plotly_chart(artist_fig, use_container_width=True)
    
    # Distribution analysis
    st.subheader("📊 Distribution Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if 'Spotify Streams' in df_filtered.columns:
            try:
                fig = px.histogram(
                    df_filtered,
                    x='Spotify Streams',
                    nbins=50,
                    title='Distribution of Spotify Streams',
                    marginal='box'
                )
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
            except Exception as e:
                st.error(f"Error creating streams distribution: {str(e)}")
    
    with col2:
        if 'Spotify Popularity' in df_filtered.columns:
            try:
                fig = px.histogram(
                    df_filtered,
                    x='Spotify Popularity',
                    nbins=30,
                    title='Distribution of Spotify Popularity',
                    marginal='box'
                )
                fig.update_layout(height=400)
                st.plotly_chart(fig, use_container_width=True)
            except Exception as e:
                st.error(f"Error creating popularity distribution: {str(e)}")
    
    # Correlation analysis
    st.subheader("🔗 Correlation Analysis")
    corr_fig = create_correlation_heatmap(df_filtered)
    if corr_fig:
        st.plotly_chart(corr_fig, use_container_width=True)
    
    # Advanced Analytics
    st.header("🔍 Advanced Analytics")
    
    # Scatter plot analysis
    numeric_cols = df_filtered.select_dtypes(include=[np.number]).columns.tolist()
    if len(numeric_cols) >= 2:
        col1, col2 = st.columns(2)
        
        with col1:
            x_axis = st.selectbox("Select X-axis", numeric_cols, index=0)
        with col2:
            y_axis = st.selectbox("Select Y-axis", numeric_cols, index=1 if len(numeric_cols) > 1 else 0)
        
        if x_axis != y_axis:
            try:
                fig = px.scatter(
                    df_filtered.sample(min(1000, len(df_filtered))),  # Sample for performance
                    x=x_axis,
                    y=y_axis,
                    hover_data=['Track', 'Artist(s)'] if all(col in df_filtered.columns for col in ['Track', 'Artist(s)']) else None,
                    title=f'{y_axis} vs {x_axis}',
                    trendline='ols'
                )
                fig.update_layout(height=500)
                st.plotly_chart(fig, use_container_width=True)
            except Exception as e:
                st.error(f"Error creating scatter plot: {str(e)}")
    
    # Data table
    st.header("📋 Data Explorer")
    
    # Search functionality
    search_term = ""
    if 'Track' in df_filtered.columns:
        search_term = st.text_input("Search tracks:", placeholder="Enter song name...")
        if search_term:
            try:
                mask = df_filtered['Track'].str.contains(search_term, case=False, na=False)
                display_df = df_filtered[mask]
            except:
                display_df = df_filtered
        else:
            display_df = df_filtered
    else:
        display_df = df_filtered
    
    # Show data
    if len(display_df) > 0:
        st.dataframe(
            display_df.head(100),
            use_container_width=True,
            height=400
        )
    else:
        st.warning("No data matches your search criteria.")
    
    # Download section
    st.header("💾 Export Data")
    col1, col2 = st.columns(2)
    
    with col1:
        try:
            csv = df_filtered.to_csv(index=False)
            st.download_button(
                label="📥 Download Filtered Data (CSV)",
                data=csv,
                file_name=f'spotify_filtered_data_{datetime.now().strftime("%Y%m%d")}.csv',
                mime='text/csv'
            )
        except Exception as e:
            st.error(f"Error preparing download: {str(e)}")
    
    with col2:
        if st.button("📊 Generate Summary Report"):
            try:
                st.subheader("Summary Statistics")
                st.write(df_filtered.describe())
            except Exception as e:
                st.error(f"Error generating summary: {str(e)}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        st.error(f"Application error: {str(e)}")
        st.info("Please refresh the page or contact support if the issue persists.")
