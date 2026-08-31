import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  final ApiService _apiService = ApiService();

  bool get isAuthenticated => _user != null;
  User? get user => _user;

  Future<void> login(String email, String password) async {
    try {
      final user = await _apiService.login(email, password);
      _user = user;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await _apiService.logout();
    _user = null;
    notifyListeners();
  }
}
