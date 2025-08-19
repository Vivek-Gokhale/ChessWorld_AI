"""
Optional Stockfish Analysis Backend
Run with: python scripts/stockfish-backend.py

This provides the extra credit Stockfish analysis functionality.
Requires: pip install flask python-chess stockfish
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import chess
import chess.pgn
import io
from stockfish import Stockfish

app = Flask(__name__)
CORS(app)

# Initialize Stockfish (adjust path as needed)
# Download Stockfish from https://stockfishchess.org/download/
stockfish = Stockfish(path="/usr/local/bin/stockfish", depth=10)

@app.route('/analyze', methods=['POST'])
def analyze_game():
    try:
        data = request.get_json()
        pgn_string = data.get('pgn', '')
        
        if not pgn_string:
            return jsonify({'error': 'PGN required'}), 400
        
        # Parse PGN
        pgn_io = io.StringIO(pgn_string)
        game = chess.pgn.read_game(pgn_io)
        
        if not game:
            return jsonify({'error': 'Invalid PGN'}), 400
        
        # Analyze each position
        board = game.board()
        eval_trend = []
        mistakes = []
        blunders = []
        
        move_number = 0
        prev_eval = 0
        
        for move in game.mainline_moves():
            board.push(move)
            move_number += 1
            
            # Set position in Stockfish
            stockfish.set_fen_position(board.fen())
            
            # Get evaluation
            evaluation = stockfish.get_evaluation()
            
            if evaluation['type'] == 'cp':
                current_eval = evaluation['value']
            elif evaluation['type'] == 'mate':
                # Convert mate scores to centipawn equivalent
                mate_value = evaluation['value']
                current_eval = 2000 if mate_value > 0 else -2000
            else:
                current_eval = 0
            
            eval_trend.append(current_eval)
            
            # Detect mistakes and blunders
            if move_number > 1:
                eval_diff = abs(current_eval - prev_eval)
                
                if eval_diff >= 300:  # Blunder threshold
                    blunders.append({
                        'move': move_number,
                        'centipawns': eval_diff
                    })
                elif eval_diff >= 150:  # Mistake threshold
                    mistakes.append({
                        'move': move_number,
                        'centipawns': eval_diff
                    })
            
            prev_eval = current_eval
            
            # Limit analysis to first 50 moves for performance
            if move_number >= 50:
                break
        
        return jsonify({
            'evalTrend': eval_trend,
            'mistakes': mistakes,
            'blunders': blunders
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'stockfish_available': stockfish.is_fen_valid("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")})

if __name__ == '__main__':
    print("Starting Stockfish Analysis Backend...")
    print("Make sure Stockfish is installed and the path is correct")
    app.run(debug=True, port=5000)
