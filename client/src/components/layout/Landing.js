import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='landing-inner'>
        <h1>Hobby app</h1>
        <div className='buttons'>
          <p>Login</p>
          <p>Sign up</p>
        </div>
      </div>
    </section>
  );
};
