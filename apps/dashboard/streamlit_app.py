import streamlit as st

st.title("Donny DevOps Control Plane")

repos = [
    "sales-horizon",
    "geo-analytics-api",
    "log-triage-sandbox",
    "docker-sklearn-api"
]

for repo in repos:
    st.subheader(repo)
    st.button(f"Trigger CI for {repo}")
