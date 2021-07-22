import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import dotenv from 'dotenv';

const isDevelopment = process.env.NODE_ENV !== 'production';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.development.env' : '.production.env',
});

console.log(process.env.NODE_ENV);

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  name: 'slack',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], //babel이 처리할 확장자 리스트
    alias: {
      // tsconfig path 경로 설정
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
      '@contexts': path.resolve(__dirname, 'contexts'),
    },
  },
  entry: {
    // main 파일
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // ts, tsx 파일을 babel-loader 가 바꿔줌
        loader: 'babel-loader',
        options: {
          // 바꿔줄때의 설정
          presets: [
            [
              '@babel/preset-env', // targets 의 브라우저에 맞게 preset으로 바꿔줌
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', // react 코드 바꿔주기
            '@babel/preset-typescript', // typescript 코드 바꿔주기
          ],
          // env: {
          //   development: {
          //     plugin: [require.resolve('react-refresh/babel')],
          //   },
          // },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/, // css 파일도 js로 바꿔줌
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      // typescript 필수
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    // process.NODE_ENV 사용 가능하게 만들어줌 (frontend 에서도)
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(process.env.API_URL),
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', // name은 entry의 key값 (app)
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router  (history url direction 해줌)
    port: 3190,
    publicPath: '/dist/',
    proxy: {
      // api로 시작하는 request는 target 주소로 바꿔서 보내겠다. cors 해결
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: true }));
}

export default config;
