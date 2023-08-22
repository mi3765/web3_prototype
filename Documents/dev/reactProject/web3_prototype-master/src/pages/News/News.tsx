import React from 'react';
import "./News.scss";
import { ExhibitHeader } from '../../components/Header/ExhibitHeader';

export const News = () => {
  return (
    <div className="news-container">
      <ExhibitHeader />
      <h2 className="news-title">お知らせ</h2>
      <ul className="news-title-container">
        <li className="news-title-list">お知らせ</li>
        <li className="news-title-list">ニュース</li>
      </ul>
      <div>
        {/* TODO: textを左揃え */}
        <ul className="news-items">
          <li className="news-item">事務局から個別メッセージ「ログイン通知」</li>
          <li className="news-item">事務局から個別メッセージ「ログイン通知」</li>
          <li className="news-item">事務局から個別メッセージ「ログイン通知」</li>
          <li className="news-item">事務局から個別メッセージ「ログイン通知」</li>
        </ul>
      </div>
    </div>
  )
}
