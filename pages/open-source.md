---
layout: default
title: Open Source Projects
keywords: 开源,open-source,GitHub,开源项目
description: 开源改变世界。
permalink: /open-source/
menu: 开源
---

{% assign github_repos = site.github.public_repositories %}
{% assign repo_data_source = 'github' %}
{% if github_repos and github_repos.size > 0 %}
{% assign sorted_repos = github_repos | sort: 'stargazers_count' | reverse %}
{% else %}
{% assign sorted_repos = site.data.open_source_repos | sort: 'stargazers_count' | reverse %}
{% assign repo_data_source = 'fallback' %}
{% endif %}

<section class="container">
    <header class="text-center">
        <h1>Open Source Projects</h1>
        <p class="lead">I have <span class="repo-count">{{ sorted_repos.size }}</span> projects on Github</p>
        {% if repo_data_source == 'fallback' %}
        <p class="posts-list" style="margin-top: 4px;">当前展示的是缓存仓库列表（GitHub API 限流时自动启用）。</p>
        {% endif %}
    </header>
    <div class="repo-list">
        <!-- Check here for github metadata -->
        <!-- https://help.github.com/articles/repository-metadata-on-github-pages/ -->
        {% for repo in sorted_repos %}
        <a href="{{ repo.html_url }}" target="_blank" class="one-third-column card text-center">
            <div class="thumbnail">
                <div class="card-image geopattern" data-pattern-id="{{ repo.name }}">
                    <div class="card-image-cell">
                        <h3 class="card-title">
                            {{ repo.name }}
                        </h3>
                    </div>
                </div>
                <div class="caption">
                    <div class="card-description">
                        <p class="card-text">{{ repo.description }}</p>
                    </div>
                    <div class="card-text">
                        <span class="meta-info" title="{{ repo.stargazers_count }} stars">
                            <span class="octicon octicon-star"></span> {{ repo.stargazers_count }}
                        </span>
                        <span class="meta-info" title="{{ repo.forks_count }} forks">
                            <span class="octicon octicon-git-branch"></span> {{ repo.forks_count }}
                        </span>
                        {% assign repo_updated_label = repo.updated_label | default: repo.updated_at %}
                        <span class="meta-info" title="Last updated：{{ repo_updated_label }}">
                            <span class="octicon octicon-clock"></span>
                            {% if repo.updated_at and repo.updated_at != '' %}
                            <time datetime="{{ repo.updated_at }}">{{ repo.updated_at | date: '%Y-%m-%d' }}</time>
                            {% else %}
                            <time>{{ repo_updated_label }}</time>
                            {% endif %}
                        </span>
                    </div>
                </div>
            </div>
        </a>
        {% endfor %}
    </div>
</section>
